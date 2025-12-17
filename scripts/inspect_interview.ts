
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspect() {
    const { data, error } = await supabase
        .from('questions')
        .select('id, question, category:theme, metadata')
        .eq('type', 'interview');

    if (error) console.error(error);
    else {
        console.log(`Found ${data.length} interview questions.`);
        fs.writeFileSync('interview_dump.json', JSON.stringify(data, null, 2));
    }
}

inspect();
