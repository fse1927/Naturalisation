
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

function generateId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

async function reformatIds() {
    console.log('Fetching all questions...');
    const { data: questions, error } = await supabase.from('questions').select('id');

    if (error) {
        console.error('Error fetching questions:', error);
        return;
    }

    console.log(`Found ${questions.length} questions. Processing...`);

    const idMap = new Map<string, string>();
    const usedIds = new Set<string>();

    // Pre-generate IDs ensuring uniqueness
    for (const q of questions) {
        let newId = generateId();
        while (usedIds.has(newId)) {
            newId = generateId();
        }
        usedIds.add(newId);
        idMap.set(q.id, newId);
    }

    console.log('IDs generated. Starting updates...');

    // We must update sequentially to avoid primary key collisions if any overlap (unlikely with reformatted IDs vs old strings)
    // But we also need to update user_progress.

    // Since we can't do a transaction easily via JS client for multiple tables without RPC, 
    // we will iterate. Ideally this should be a PL/PGSQL function, but JS script is requested "Analyze and Correct".

    let updatedCount = 0;

    // Check if we can just update the ID.
    // If user_progress references it roughly, we update that too.

    for (const [oldId, newId] of idMap) {
        // 1. Update User Progress references first? 
        // No, if real FK exists, we update Parent first then Child typically for CASADE, 
        // but here ID is PK. If we change PK, we break orphan children unless CASCADE is on.
        // We verified schema has NO FK constraint on user_progress.module_id.
        // So order doesn't strictly matter for constraints, but for consistency:

        // Update user_progress
        const { error: progError } = await supabase
            .from('user_progress')
            .update({ module_id: newId })
            .eq('module_id', oldId);

        if (progError) console.error(`Failed to update progress for ${oldId}:`, progError.message);

        // Update Question ID
        const { error: qError } = await supabase
            .from('questions')
            .update({ id: newId })
            .eq('id', oldId);

        if (qError) {
            console.error(`Failed to update ID ${oldId} -> ${newId}:`, qError.message);
        } else {
            updatedCount++;
            if (updatedCount % 50 === 0) console.log(`Updated ${updatedCount}/${questions.length}`);
        }
    }

    console.log('Correction complete.');
}

reformatIds();
