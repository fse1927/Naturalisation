'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateFeedbackStatus(id: string, status: 'resolved' | 'ignored') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('feedbacks_questions')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/feedback');
}
