'use server';

import { createClient } from '@/lib/supabase/server';
import { Question } from '@/lib/types'; // We might need to update types to match DB schema

export type QuestionsFilter = {
    theme?: string;
    chapter?: string; // For Info Cards
    search?: string;
    difficulty?: string;
};

export async function getQuestions(
    filter: QuestionsFilter = {},
    page: number = 1,
    limit: number = 20
) {
    const supabase = await createClient();

    let query = supabase
        .from('questions')
        .select('*', { count: 'exact' })
        .eq('type', 'quiz');

    if (filter.theme) {
        query = query.eq('theme', filter.theme);
    }

    if (filter.difficulty) {
        query = query.eq('difficulty', filter.difficulty);
    }

    if (filter.chapter) {
        query = query.eq('info_cards_chapter', filter.chapter);
    }

    // Simple search on question text
    if (filter.search) {
        query = query.ilike('question', `%${filter.search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to fetch questions');
    }

    return {
        questions: data as any[], // Cast to Question type after fixing types
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 0
    };
}

export async function getInterviewQuestions(userSituation?: string) {
    const supabase = await createClient();

    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('type', 'interview');

    if (error) {
        console.error('Error fetching interview questions:', error);
        return [];
    }

    if (!userSituation) {
        return questions;
    }

    // Weighting/Sorting Logic
    // Prioritize questions where metadata->required_for contains userSituation
    // Note: metadata is JSONB. We can do this sort in JS for flexibility or SQL.
    // Given the dataset is small (~100 questions), JS sort is fine and flexible.

    const sortedDetails = questions.sort((a, b) => {
        const requiredA = (a.metadata as any)?.required_for || [];
        const requiredB = (b.metadata as any)?.required_for || [];

        const aMatches = requiredA.includes(userSituation.toLowerCase());
        const bMatches = requiredB.includes(userSituation.toLowerCase());

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
    });

    return sortedDetails;
}

export async function getRandomQuizQuestions(limit: number = 10) {
    const supabase = await createClient();

    // Postgres 'random()' ordering via Supabase can be tricky without RPC.
    // A simple approach for small datasets is to fetch IDs, shuffle, then fetch details.
    // Or just fetch a larger chunk and shuffle in memory if dataset is small (<1000).
    // Our dataset is ~1000. Fetching all IDs is cheap.

    // 1. Fetch all IDs with their difficulty
    const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('id, difficulty')
        .eq('type', 'quiz');

    if (error || !allQuestions || allQuestions.length === 0) {
        console.error('Error fetching question IDs:', error);
        return [];
    }

    // 2. Group by difficulty
    const buckets: Record<string, number[]> = {
        facile: [],
        moyen: [],
        difficile: []
    };

    allQuestions.forEach(q => {
        // Normalize difficulty to lower case and handle nulls/unknowns as 'moyen'
        const diff = (q.difficulty || 'moyen').toLowerCase();
        if (buckets[diff]) {
            buckets[diff].push(q.id);
        } else {
            buckets['moyen'].push(q.id);
        }
    });

    // 3. Define Quotas (approximate counts)
    const totalNeeded = limit;
    const quotas = {
        facile: Math.round(totalNeeded * 0.30),    // 30%
        moyen: Math.round(totalNeeded * 0.40),     // 40%
        difficile: Math.round(totalNeeded * 0.30)  // 30%
    };

    // Adjust quotas to make sure they sum exactly to totalNeeded
    // (Rounding might cause off-by-one errors)
    const currentSum = quotas.facile + quotas.moyen + quotas.difficile;
    const diff = totalNeeded - currentSum;
    if (diff !== 0) {
        quotas.moyen += diff; // Dump remainder into medium
    }

    // 4. Select IDs
    let selectedIds: number[] = [];

    // Helper to pick random N items from an array
    const pickRandom = (arr: number[], n: number) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    // We try to fill quotas. If a bucket doesn't have enough, we take all of it 
    // and note how many we still need.
    let deficiency = 0;

    // Process strictly in order to handle deficiencies: Facile -> Difficile -> Moyen (as sink)
    // Actually, a generic loop is better.

    // First pass: take what we can for each category
    const taken: Record<string, number[]> = {
        facile: [],
        moyen: [],
        difficile: []
    };

    (['facile', 'difficile', 'moyen'] as const).forEach(key => {
        const needed = quotas[key];
        const available = buckets[key];
        const picked = pickRandom(available, needed);
        taken[key] = picked;

        // If we didn't get enough, add to deficiency
        if (picked.length < needed) {
            deficiency += (needed - picked.length);
        }
    });

    // If we have deficiency, try to fill it from other buckets ensuring we don't pick duplicates
    // We already picked unique IDs from each bucket, so remaining items in buckets are available.
    if (deficiency > 0) {
        const allRemainingIds: number[] = [];
        (['facile', 'moyen', 'difficile'] as const).forEach(key => {
            const usedIds = new Set(taken[key]);
            const remaining = buckets[key].filter(id => !usedIds.has(id));
            allRemainingIds.push(...remaining);
        });

        // Pick random to fill deficiency
        const extras = pickRandom(allRemainingIds, deficiency);
        selectedIds = [
            ...taken.facile,
            ...taken.moyen,
            ...taken.difficile,
            ...extras
        ];
    } else {
        selectedIds = [
            ...taken.facile,
            ...taken.moyen,
            ...taken.difficile
        ];
    }

    // Shuffle final selected IDs to mix difficulties
    selectedIds = selectedIds.sort(() => 0.5 - Math.random());

    // 5. Fetch full details
    const { data } = await supabase
        .from('questions')
        .select('*')
        .in('id', selectedIds);

    // Filter out invalid questions and shuffle again (order from DB isn't guaranteed)
    // We want the order of 'data' to match 'selectedIds' to maintain the shuffle? 
    // Actually, SQL 'IN' doesn't guarantee order. We should shuffle the final result array.

    const validQuestions = (data || []).filter(q => {
        return q.options && Array.isArray(q.options) && q.options.length >= 2;
    });

    return validQuestions.sort(() => 0.5 - Math.random());
}
