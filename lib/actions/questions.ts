'use server';

import { createClient } from '@/lib/supabase/server';
import { Question } from '@/lib/types'; // We might need to update types to match DB schema

export type QuestionsFilter = {
    theme?: string;
    chapter?: string; // For Info Cards
    search?: string;
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

    const { data: allIds, error } = await supabase
        .from('questions')
        .select('id')
        .eq('type', 'quiz');

    if (!allIds || allIds.length === 0) return [];

    // Shuffle IDs
    const shuffledIds = allIds.sort(() => 0.5 - Math.random()).slice(0, limit).map(row => row.id);

    // Fetch full questions for these IDs
    const { data } = await supabase
        .from('questions')
        .select('*')
        .in('id', shuffledIds);

    // Filter out invalid questions (empty options or duplicates)
    // Sometimes DB contains interview questions marked as quiz with empty options
    const validQuestions = (data || []).filter(q => {
        return q.options && Array.isArray(q.options) && q.options.length >= 2;
    });

    return validQuestions;
}
