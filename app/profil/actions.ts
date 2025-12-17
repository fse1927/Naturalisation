'use server'

import { createClient } from '@/lib/supabase/server'
import { UserProfile, UserStats } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(): Promise<{ user: UserProfile; stats: UserStats } | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    let { data: profile } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', user.id)
        .single()

    // Lazy Sync: If profile missing but user exists (Trigger failure recovery)
    if (!profile) {
        console.warn('Profile missing for user, attempting lazy sync...', user.id);
        const { data: newProfile, error } = await supabase
            .from('utilisateurs')
            .insert({
                id: user.id,
                nom_prenom: user.user_metadata?.full_name || 'Utilisateur',
                profil_situation: user.user_metadata?.situation || 'Non défini',
                email: user.email // Store email in public table if needed/schema allows, otherwise relying on join
            })
            .select()
            .single();

        if (!error && newProfile) {
            profile = newProfile;
        } else {
            console.error('Failed to lazy sync profile:', error);
            // Return basic mock to avoid blocking login loop
            profile = {
                id: user.id,
                nom_prenom: user.user_metadata?.full_name || 'Utilisateur',
                profil_situation: user.user_metadata?.situation || 'Non défini',
                email: user.email,
                is_admin: false
            } as any;
        }
    }

    // Also fetch stats - Last 10 tests for chart
    const { data: history } = await supabase
        .from('historique_tests')
        .select('score_pourcentage, date_test')
        .eq('user_id', user.id)
        .order('date_test', { ascending: false })
        .limit(10)

    const totalTests = await supabase
        .from('historique_tests')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then(res => res.count || 0)

    // Calculate average from all tests (we might want a separate query or just use the last 10? 
    // Ideally avg should be global. Let's make a separate query for global avg if needed, 
    // or just use the last 10 for simplicity in this MVP phrase.
    // Actually, let's fetch ALL for stats, but only return last 10 for chart?
    // Optimization: fetch average using database aggregation if possible, but for now fetching all scores (idk how many) might be heavy.
    // Let's stick to simple: fetch last 50 for stats, return last 10 for chart.

    // Efficient way:
    // 1. Count total
    // 2. Avg score (RPC or separate select) - let's just do a separate lightweight select for avg if we want accuracy.
    // For now, let's keep it simple: fetched history is for the chart (last 10). 
    // We need another query for global stats if we want them accurate.

    // Let's rely on the previous logic but refine it.
    const { data: allScores } = await supabase
        .from('historique_tests')
        .select('score_pourcentage')
        .eq('user_id', user.id)

    const realTotal = allScores?.length || 0
    const realAvg = realTotal > 0
        ? Math.round(allScores!.reduce((acc, curr) => acc + curr.score_pourcentage, 0) / realTotal)
        : 0

    // Reverse history for chart (Oldest -> Newest)
    const chartData = history ? [...history].reverse() : []

    return {
        user: {
            ...profile,
            email: user.email
        } as UserProfile,
        stats: {
            totalTests: realTotal,
            avgScore: realAvg,
            history: chartData
        }
    }
}

export async function updateUserProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const nom_prenom = formData.get('nom_prenom') as string
    const profil_situation = formData.get('profil_situation') as string

    const { error } = await supabase
        .from('utilisateurs')
        .update({ nom_prenom, profil_situation })
        .eq('id', user.id)

    if (error) throw new Error('Failed to update profile')

    revalidatePath('/profil')
}
