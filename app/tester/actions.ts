'use server'

import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/data/types'
import { revalidatePath } from 'next/cache'

export async function getQuizQuestions(limit: number = 20): Promise<Question[]> {
    const supabase = await createClient()

    // Note: random() is not natively supported in supabase-js select modifier easily for large datasets without RPC,
    // but for small datasets we can fetch more and shuffle, or use a specific postgres function if added.
    // For now, let's fetch roughly all (assuming < 1000 questions) and shuffle server-side, 
    // or just fetch a range. To be simple and robust for mvp:

    const { data, error } = await supabase
        .from('questions')
        .select('*')

    if (error || !data) {
        console.error('Error fetching questions:', error)
        return []
    }

    // Shuffle and slice
    const shuffled = data.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, limit) as Question[]
}

export async function saveQuizResult(
    scorePourcentage: number,
    tempsSecondes: number,
    questionsManquees: (string | number)[]
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
        .from('historique_tests')
        .insert({
            user_id: user.id,
            score_pourcentage: scorePourcentage,
            temps_total_secondes: tempsSecondes,
            questions_manquees: questionsManquees,
            date_test: new Date().toISOString()
        })

    if (error) {
        console.error('Error saving result:', error)
        throw new Error('Failed to save result')
    }

    revalidatePath('/profil')
}
