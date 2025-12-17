
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking connection...");
    const { data, error } = await supabase.from('questions').select('*').limit(1);

    if (error) {
        console.error("Diagnostic Error:", error.message);
        if (error.code === '42P01') {
            console.log("CRITICAL: Table 'questions' does not exist.");
        } else if (error.message.includes('column')) {
            console.log("CRITICAL: Schema mismatch. Column missing.");
        }
    } else {
        console.log("Success: Table 'questions' exists and is accessible.");
        console.log("Row sample:", data);
    }
}

check();
