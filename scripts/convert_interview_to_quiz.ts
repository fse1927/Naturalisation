
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
    console.log('Fetching interview questions...');
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question, answer, options')
        .eq('type', 'interview');

    if (error || !questions) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${questions.length} interview questions to convert.`);

    let sqlContent = `-- Converting Interview questions to Quiz format\n`;

    const defaultOptions = ['[A compléter]', '[Autre choix 1]', '[Autre choix 2]'];
    const defaultAnswer = '[A compléter]';

    if (questions.length > 0) {
        // We can do a single bulk update if they all get the same default
        // But let's generate ID-based updates in case we want to customize later
        const ids = questions.map(q => `'${q.id}'`).join(',');

        // Postgres array syntax for text[]: ARRAY['a','b'] or '{a,b}'
        const optionsSql = `ARRAY['${defaultOptions[0]}', '${defaultOptions[1]}', '${defaultOptions[2]}']`;

        sqlContent += `
        UPDATE public.questions 
        SET 
            type = 'quiz',
            options = ${optionsSql},
            answer = '${defaultAnswer}'
        WHERE id IN (${ids});
        `;
    }

    const outputPath = path.resolve(__dirname, '../supabase/migrations/20251217_convert_interview_to_quiz.sql');
    fs.writeFileSync(outputPath, sqlContent);
    console.log(`Generated SQL at: ${outputPath}`);
}

run();
