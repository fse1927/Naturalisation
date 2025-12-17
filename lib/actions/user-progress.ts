'use server';

import { createClient } from '@/lib/supabase/server';
import { UserStats } from '@/lib/types';

export async function markModuleAsLearned(moduleId: string) {
    const supabase = await createClient();
    // Using simple auth check via supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            module_id: moduleId,
            learned_at: new Date().toISOString()
        }, { onConflict: 'user_id, module_id' });

    if (error) {
        console.error('Error marking module as learned:', error);
        return { error: 'Failed to save progress' };
    }

    return { success: true };
}

export async function isModuleLearned(moduleId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();

    return !!data;
}

export async function getUserStats(): Promise<UserStats> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            totalTests: 0,
            avgScore: 0,
            history: []
        };
    }

    // Fetch history
    const { data: history, error } = await supabase
        .from('historique_tests')
        .select('*')
        .eq('user_id', user.id)
        .order('date_test', { ascending: false });

    if (error || !history) {
        return { totalTests: 0, avgScore: 0, history: [] };
    }

    const totalTests = history.length;
    const avgScore = totalTests > 0
        ? Math.round(history.reduce((acc, curr) => acc + curr.score_pourcentage, 0) / totalTests)
        : 0;

    return {
        totalTests,
        avgScore,
        history: history.map(h => ({
            score_pourcentage: h.score_pourcentage,
            date_test: h.date_test
        }))
    };
}

export async function getUserProgressList() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('user_progress')
        .select('module_id')
        .eq('user_id', user.id);

    return (data || []).map(row => row.module_id);
}

export async function getGlobalProgress() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Count learnt
    const { count: learntCount } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // Count total (from questions/content)
    // Assuming 'questions' table holds the learning content
    const { count: totalCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'quiz'); // Only count quiz/learning items

    if (!totalCount) return 0;

    return Math.round(((learntCount || 0) / totalCount) * 100);
}
