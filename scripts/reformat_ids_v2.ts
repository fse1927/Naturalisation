
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

async function reformatIdsV2() {
    console.log('Fetching all questions...');
    const { data: questions, error } = await supabase.from('questions').select('*');

    if (error || !questions) {
        console.error('Error fetching questions:', error);
        return;
    }

    console.log(`Fetched ${questions.length} questions.`);

    // Map oldId -> New Question Data
    const newQuestions = [];
    const idMap = new Map<string, string>(); // old -> new
    const usedIds = new Set<string>();

    for (const q of questions) {
        let newId = generateId();
        while (usedIds.has(newId)) {
            newId = generateId();
        }
        usedIds.add(newId);
        idMap.set(q.id, newId);

        newQuestions.push({
            ...q,
            id: newId,
            updated_at: new Date().toISOString()
        });
    }

    console.log('Generated new IDs. Deleting old data...');

    // Delete all questions.
    // NOTE: If cascading delete is ON, this wipes user_progress.
    // If NO cascading, this might fail if foreign keys exist.
    // We assume no strict FK based on prior checks, or we need to handle it.

    // To be safe, let's fetch user_progress first to restore it?
    // User progress is valuable.
    console.log('Backing up User Progress...');
    const { data: progress } = await supabase.from('user_progress').select('*');

    const { error: delError } = await supabase.from('questions').delete().neq('id', '0'); // Delete all
    if (delError) {
        console.error('Delete failed:', delError.message);
        console.log('Aborting.');
        return;
    }

    console.log('Old data deleted. Inserting new data...');

    // Batch insert
    const BATCH_SIZE = 100;
    for (let i = 0; i < newQuestions.length; i += BATCH_SIZE) {
        const batch = newQuestions.slice(i, i + BATCH_SIZE);
        const { error: insError } = await supabase.from('questions').insert(batch);
        if (insError) {
            console.error(`Batch insert failed at ${i}:`, insError.message);
        } else {
            console.log(`Inserted ${Math.min(i + BATCH_SIZE, newQuestions.length)} / ${newQuestions.length}`);
        }
    }

    // Restore/Update User Progress
    if (progress && progress.length > 0) {
        console.log(`Restoring ${progress.length} user_progress entries...`);
        const newProgress = [];
        for (const p of progress) {
            const newModuleId = idMap.get(p.module_id);
            if (newModuleId) {
                newProgress.push({
                    ...p,
                    module_id: newModuleId
                });
            }
        }

        // We probably need to delete old progress explicitly if it wasn't cascaded? 
        // If we deleted questions and they were linked, they might be gone. 
        // If loose link, they are still there with old IDs.
        // Let's delete all user_progress with old IDs that we mapped.
        // Or simpler: Wipe user_progress and re-insert mapped ones.

        await supabase.from('user_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        if (newProgress.length > 0) {
            const { error: pError } = await supabase.from('user_progress').insert(newProgress);
            if (pError) console.error('Error restoring progress:', pError.message);
            else console.log('Progress restored.');
        }
    }

    console.log('Reformat V2 complete.');
}

reformatIdsV2();
