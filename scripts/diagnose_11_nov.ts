
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

async function diagnose() {
    console.log('Searching for "11 novembre"...');
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .ilike('question', '%11 novembre%');

    if (error) {
        console.error('Error fetching question:', error);
    } else {
        console.log(`Found ${data.length} matches.`);
        data.forEach((q, i) => {
            console.log(`\n--- Match ${i + 1} ---`);
            console.log('ID:', q.id);
            console.log('Type:', q.type);
            console.log('Question:', q.question);
            console.log('Options (Raw):', JSON.stringify(q.options));
            console.log('Options Length:', q.options ? q.options.length : 'null');
        });
    }
}

diagnose();
