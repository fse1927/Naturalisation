
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Keywords for analysis
const KEYWORDS_DIFFICILE = [
    'député', 'sénateur', 'constitution', 'promulgue', 'investiture',
    'conseil constitutionnel', 'suffrage', 'laïque', '1905', '1944',
    'république', 'parlement', 'cohabitation', '49-3', 'édit de nantes',
    'guerres de religion', 'ordonnance', 'villers-cotterêts', 'schengen',
    'maastricht', 'euro', 'européenne', 'jurisprudence', 'cassation'
];

const KEYWORDS_FACILE = [
    'drapeau', 'couleurs', 'bleu', 'blanc', 'rouge', 'hymne', 'marseillaise',
    'devise', 'liberté', 'égalité', 'fraternité', '14 juillet', 'fête',
    'paris', 'tour eiffel', 'coq', 'mariane', 'président', 'macron',
    'hexagone', 'langue', 'capitale', 'loire', 'seine', 'rhône', 'garonne'
];

function evaluateDifficulty(question: string): 'facile' | 'moyen' | 'difficile' {
    const text = question.toLowerCase();

    // Check Hard
    if (KEYWORDS_DIFFICILE.some(k => text.includes(k))) return 'difficile';
    if (text.length > 120) return 'difficile';

    // Check Easy
    if (KEYWORDS_FACILE.some(k => text.includes(k))) return 'facile';
    if (text.length < 50) return 'facile';

    return 'moyen';
}

import fs from 'fs';

async function run() {
    console.log('Fetching questions...');
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question, difficulty');

    if (error || !questions) {
        console.error('Error fetching questions:', error);
        return;
    }

    console.log(`Analyzing ${questions.length} questions...`);

    const updates = {
        facile: [] as string[],
        moyen: [] as string[],
        difficile: [] as string[]
    };

    for (const q of questions) {
        const newDifficulty = evaluateDifficulty(q.question);
        if (q.difficulty !== newDifficulty) {
            updates[newDifficulty].push(q.id);
        }
    }

    console.log(`Generating SQL for updates...`);
    console.log(`- Facile: ${updates.facile.length}`);
    console.log(`- Moyen: ${updates.moyen.length}`);
    console.log(`- Difficile: ${updates.difficile.length}`);

    let sqlContent = `-- AI Difficulty Evaluation Updates\n`;

    // Facile
    if (updates.facile.length > 0) {
        const ids = updates.facile.map(id => `'${id}'`).join(',');
        sqlContent += `UPDATE public.questions SET difficulty = 'facile' WHERE id IN (${ids});\n`;
    }

    // Difficile
    if (updates.difficile.length > 0) {
        const ids = updates.difficile.map(id => `'${id}'`).join(',');
        sqlContent += `UPDATE public.questions SET difficulty = 'difficile' WHERE id IN (${ids});\n`;
    }

    // Moyen (if any need revert)
    if (updates.moyen.length > 0) {
        const ids = updates.moyen.map(id => `'${id}'`).join(',');
        sqlContent += `UPDATE public.questions SET difficulty = 'moyen' WHERE id IN (${ids});\n`;
    }

    const outputPath = path.resolve(__dirname, '../supabase/migrations/20251217_apply_difficulty_levels.sql');
    fs.writeFileSync(outputPath, sqlContent);

    console.log(`SQL migration file generated at: ${outputPath}`);
}

run();
