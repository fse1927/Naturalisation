'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertQuestion(formData: FormData) {
    const supabase = await createClient();

    // Check auth/admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // We trust middleware but good to double check or rely on RLS
    // RLS "Admin write access" will block if not admin.

    const id = formData.get('id') as string | null;
    const question = formData.get('question') as string;
    const answer = formData.get('reponse_correcte') as string;
    const theme = formData.get('theme') as string;
    const type = formData.get('type') as string;

    // Handle options (dynamic inputs in form, gathered here)
    const option1 = formData.get('option_1') as string;
    const option2 = formData.get('option_2') as string;
    const option3 = formData.get('option_3') as string;
    const options = [option1, option2, option3].filter(Boolean);

    // Metadata
    const tips = formData.get('tips') as string;
    const difficulty = formData.get('difficulty') as string;
    const metadata = {
        tips,
        difficulty
    };

    const payload: any = {
        question,
        answer, // Note: DB column might be 'answer' or 'reponse_correcte' depending on migration script. 
        // Script Step 64 said: "answer TEXT NOT NULL", "reponse_correcte" was in types.ts.
        // I will use 'answer' and 'options' columns as per migration script.
        theme,
        type,
        options: type === 'quiz' ? options : [],
        metadata,
        updated_at: new Date().toISOString()
    };

    let error;

    if (id) {
        // Update
        const { error: updateError } = await supabase
            .from('questions')
            .update(payload)
            .eq('id', id);
        error = updateError;
    } else {
        // Insert
        // ID is text? Migration said "id TEXT PRIMARY KEY". 
        // If I insert without ID, it fails if no default gen_random_uuid() or if it expects text ID.
        // Migration Step 64: "id TEXT PRIMARY KEY".
        // It does NOT have a default generator. 
        // I must generate an ID.
        // Use crypto.randomUUID()
        const newId = crypto.randomUUID();
        payload.id = newId;

        const { error: insertError } = await supabase
            .from('questions')
            .insert(payload);
        error = insertError;
    }

    if (error) {
        console.error('Error saving question:', error);
        throw new Error('Failed to save question');
    }

    revalidatePath('/admin/questions');
}

export async function deleteQuestion(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/questions');
}

export async function importQuestions(questions: any[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const rows = questions.map(q => {
        const options = [q.option_1, q.option_2, q.option_3].filter(Boolean);
        return {
            id: crypto.randomUUID(),
            question: q.question,
            answer: q.answer,
            theme: q.theme,
            type: q.type,
            options: q.type === 'quiz' ? options : [],
            metadata: {
                tips: q.tips,
                difficulty: q.difficulty
            },
            updated_at: new Date().toISOString()
        };
    });

    const { error } = await supabase.from('questions').insert(rows);

    if (error) {
        console.error('Import error:', error);
        throw new Error('Import failed');
    }

    revalidatePath('/admin/questions');
}
