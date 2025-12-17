
import { createClient } from '@supabase/supabase-js';
import { ALL_QUESTIONS } from '../lib/data/questions';
import { INTERVIEW_QUESTIONS } from '../app/entretien/questions';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Use service role key if available for admin rights, otherwise anon key (might require RLS tweak for insert)
// Ideally for migration scripts we should use SERVICE_ROLE_KEY if we have RLS enabled and need to bypass policies.
// Checking if we have a service role key in env, usually SUPABASE_SERVICE_ROLE_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTableIfNeeded() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.log('DATABASE_URL not found, skipping table creation. Ensure table "questions" exists.');
        return;
    }

    try {
        console.log('Connecting to database to ensure table exists...');
        const postgres = require('postgres');
        const sql = postgres(dbUrl, { ssl: 'require' }); // Supabase requires SSL usually

        await sql`
            CREATE TABLE IF NOT EXISTS public.questions (
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
        // Enable RLS and Policies if possible (might fail if not owner or extensions not loaded, but basic table is fine)
        await sql`ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;`;
        // Basic policy - might fail if already exists, so wrap in try/catch block for robust script or ignore
        try {
            await sql`CREATE POLICY "Allow public read access" ON public.questions FOR SELECT USING (true);`;
        } catch (e) {
            // Policy likely exists
        }

        console.log('Table "questions" ensured.');
        await sql.end();
    } catch (error) {
        console.error('Failed to create table:', error);
    }
}

async function migrateQuestions() {
    await createTableIfNeeded();
    console.log('Starting migration...');
    const rowsToInsert = [];

    // 1. Migrate Quiz Questions (ALL_QUESTIONS)
    console.log(`Processing ${ALL_QUESTIONS.length} quiz questions...`);
    for (const q of ALL_QUESTIONS) {
        rowsToInsert.push({
            id: q.id,
            theme: q.theme,
            type: 'quiz',
            question: q.question,
            answer: q.answer,
            options: q.options,
            explanation: q.explanation,
            // Default mapping for existing themes to chapters if possible, or explicit field if added later
            info_cards_chapter: mapThemeToChapter(q.theme),
            metadata: {
                difficulty: q.difficulty,
                importance: q.importance,
                source: q.source
            }
        });
    }

    // 2. Migrate Interview Questions (INTERVIEW_QUESTIONS)
    console.log(`Processing ${INTERVIEW_QUESTIONS.length} interview questions...`);
    for (const q of INTERVIEW_QUESTIONS) {
        rowsToInsert.push({
            id: q.id,
            theme: mapCategoryToTheme(q.category), // Normalize category to theme
            type: 'interview',
            question: q.question,
            answer: '', // Interview questions might not have a direct "answer" like quiz, but we can store empty or tips
            options: [],
            explanation: '',
            info_cards_chapter: null, // Usually not linked to a specific learning chapter directly in the same way
            metadata: {
                answer_tips: q.answer_tips,
                required_for: q.required_for || []
            }
        });
    }

    console.log(`Preparing to upsert ${rowsToInsert.length} rows...`);

    // Batch insert to avoid payload limits
    const BATCH_SIZE = 100;
    for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
        const batch = rowsToInsert.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('questions').upsert(batch, { onConflict: 'id' });

        if (error) {
            console.error(`Error inserting batch ${i}:`, error);
        } else {
            console.log(`Inserted batch ${i} - ${i + batch.length}`);
        }
    }

    console.log('Migration complete!');
}

function mapThemeToChapter(theme: string): string {
    // Basic mapping, can be refined
    const mapping: Record<string, string> = {
        'Histoire': 'Histoire',
        'Institutions': 'Institutions',
        'Valeurs': 'Valeurs',
        'Géographie': 'La France dans le monde', // or specialized chapter
        'Droit': 'Institutions', // Approximated
        'Symboles': 'Valeurs',
        'Société': 'La France dans le monde' // Approximated
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

migrateQuestions().catch(console.error);
