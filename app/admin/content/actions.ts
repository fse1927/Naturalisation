'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertContent(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const id = formData.get('id') as string;
    const titre = formData.get('titre') as string;
    const texte_synthese = formData.get('texte_synthese') as string;
    const type_module = formData.get('type_module') as string;
    const audio_url = formData.get('audio_url') as string;

    const payload = {
        titre,
        texte_synthese,
        type_module,
        audio_url,
        updated_at: new Date().toISOString()
    };

    let error;
    if (id && id !== 'new') {
        const { error: updateError } = await supabase
            .from('contenu_apprentissage')
            .update(payload)
            .eq('id', id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('contenu_apprentissage')
            .insert({ ...payload, id: crypto.randomUUID() }); // Ensure logic matches DB
        error = insertError;
    }

    if (error) throw new Error('Failed to save content');

    revalidatePath('/admin/content');
    redirect('/admin/content');
}

export async function deleteContent(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('contenu_apprentissage').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/content');
}
