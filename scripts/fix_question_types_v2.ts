
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
    console.log('Fetching ALL quiz questions...');

    // Fetch all quiz questions
    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('type', 'quiz');

    if (error || !questions) {
        console.error('Error fetching questions:', error);
        return;
    }

    const invalidQuestions = questions.filter(q => {
        // Check for empty array, null, or less than 2 valid options
        return !q.options || !Array.isArray(q.options) || q.options.length < 2;
    });

    console.log(`Found ${invalidQuestions.length} INVALID quiz questions (options < 2) out of ${questions.length}.`);

    if (invalidQuestions.length > 0) {
        const ids = invalidQuestions.map(q => q.id);

        console.log(`Converting ${ids.length} questions to 'interview' type...`);

        // Update in batches of 50 to be safe and avoid large payload issues
        const batchSize = 50;
        for (let i = 0; i < ids.length; i += batchSize) {
            const batchIds = ids.slice(i, i + batchSize);
            console.log(`Processing batch ${i / batchSize + 1}...`);

            const { error: updateError, count } = await supabase
                .from('questions')
                .update({ type: 'interview' })
                .in('id', batchIds)
                .select(); // selecting returns the updated rows, helping verify

            if (updateError) {
                console.error('Update FAILED:', updateError.message);
            } else {
                console.log(`Batch success. Rows affected: unknown (Supabase simple update)`);
                // Verify one ID from the batch
                const { data: verifyData } = await supabase.from('questions').select('type').eq('id', batchIds[0]).single();
                console.log(`Verification: ID ${batchIds[0]} is now type='${verifyData?.type}'`);
            }
        }
    } else {
        console.log('No invalid questions found.');
    }
}

fixTypes();
