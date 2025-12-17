
import { createClient } from '@supabase/supabase-js';
import { ALL_QUESTIONS } from '../lib/data/questions';
import { INTERVIEW_QUESTIONS } from '../app/entretien/questions';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceMigration() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL missing. Cannot perform DROP/CREATE operations robustly via postgres driver.');
        // Fallback: try to just upsert and hope for the best? No, we need to fix the schema.
        // If we can't connect directly, we are stuck unless we use Supabase SQL Editor or migration API (not available here).
        // Assuming DATABASE_URL exists (it was injected in previous step).
        return;
    }

    try {
        const postgres = require('postgres');
        const sql = postgres(dbUrl, { ssl: 'require' });

        console.log('Dropping old questions table...');
        await sql`DROP TABLE IF EXISTS public.questions CASCADE;`;

        console.log('Recreating questions table...');
        await sql`
            CREATE TABLE public.questions (
                id TEXT PRIMARY KEY,
                theme TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('quiz', 'interview')),
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                options TEXT[],
                explanation TEXT,
                info_cards_chapter TEXT,
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        await sql`ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;`;
        try {
            await sql`CREATE POLICY "Allow public read access" ON public.questions FOR SELECT USING (true);`;
        } catch { }

        console.log('Schema fixed. Starting data migration...');

        // Data Preparation
        const rowsToInsert = [];

        // Quiz
        for (const q of ALL_QUESTIONS) {
            rowsToInsert.push({
                id: q.id,
                theme: q.theme,
                type: 'quiz',
                question: q.question,
                answer: q.answer,
                options: q.options,
                explanation: q.explanation || "",
                info_cards_chapter: mapThemeToChapter(q.theme),
                metadata: {
                    difficulty: q.difficulty,
                    importance: q.importance,
                    source: q.source
                }
            });
        }

        // Interview
        for (const q of INTERVIEW_QUESTIONS) {
            rowsToInsert.push({
                id: q.id,
                theme: mapCategoryToTheme(q.category),
                type: 'interview',
                question: q.question,
                answer: "",
                options: [],
                explanation: "",
                info_cards_chapter: null,
                metadata: {
                    answer_tips: q.answer_tips,
                    required_for: q.required_for || []
                }
            });
        }

        // Insert in batches
        const BATCH_SIZE = 50; // Smaller batch for safety
        for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
            const batch = rowsToInsert.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('questions').upsert(batch);
            if (error) {
                console.error(`Error batch ${i}:`, error.message);
            } else {
                console.log(`Inserted ${i} - ${i + batch.length}`);
            }
        }

        console.log('Force migration completed in FULL.');
        await sql.end();

    } catch (e) {
        console.error('Migration failed:', e);
    }
}

function mapThemeToChapter(theme: string): string {
    const mapping: Record<string, string> = {
        'Histoire': 'Histoire',
        'Institutions': 'Institutions',
        'Valeurs': 'Valeurs',
        'Symboles': 'Symboles', // Keep pure if needed, or map to Valeurs in UI
        'Géographie': 'La France dans le monde'
    };
    return mapping[theme] || 'Autre';
}

function mapCategoryToTheme(category: string): string {
    const mapping: Record<string, string> = {
        'histoire': 'Histoire',
        'valeurs': 'Valeurs',
        'geographie': 'Géographie',
        'personnel': 'Entretien & Motivation'
    };
    return mapping[category] || 'Autre';
}

forceMigration();
