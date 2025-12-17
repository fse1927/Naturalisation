
import { createClient } from '@supabase/supabase-js';
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

async function fixTypes() {
    console.log('Fetching ALL quiz questions to check options...');

    // Fetch all quiz questions
    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('type', 'quiz');

    if (error || !questions) {
        console.error('Error fetching questions:', error);
        return;
    }

    console.log(`Scanned ${questions.length} quiz questions.`);

    // Filter properties client-side to be sure
    const invalidQuestions = questions.filter(q => {
        const hasOptions = q.options && Array.isArray(q.options) && q.options.length >= 2;
        if (!hasOptions) {
            // Debug log for our target question
            if (q.question.includes('Envoyez-vous')) {
                console.log('TARGET FOUND!');
                console.log('Options value:', q.options); // likely null or []
                console.log('Type:', q.type);
            }
        }
        return !hasOptions;
    });

    console.log(`Found ${invalidQuestions.length} questions marked as QUIZ but with < 2 options.`);

    if (invalidQuestions.length > 0) {
        const ids = invalidQuestions.map(q => q.id);

        console.log(`Converting ${ids.length} questions to 'interview' type...`);

        const { error: updateError } = await supabase
            .from('questions')
            .update({ type: 'interview' })
            .in('id', ids);

        if (updateError) {
            console.error('Update FAILED:', updateError.message);
            console.log('Reminder: You might need to UNLOCK the database (RLS) if this fails.');
        } else {
            console.log('Success! Questions converted.');
        }
    } else {
        console.log('Everything looks matching (no single-option quizzes found based on scan).');
    }
}

fixTypes();
