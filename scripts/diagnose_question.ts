
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
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .ilike('question', '%Envoyez-vous de%')
        .single();

    if (error) {
        console.error('Error fetching question:', error);
    } else {
        console.log('Question Data:', JSON.stringify(data, null, 2));
    }
}

diagnose();
