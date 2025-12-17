
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Levenshtein Distance for fuzzy matching
function levenshtein(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

const normalize = (str: string) => str.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

async function run() {
    console.log('Fetching all questions...');
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question, created_at, type');

    if (error || !questions) {
        console.error('Error:', error);
        return;
    }

    console.log(`Analyzing ${questions.length} questions for duplicates...`);

    const visited = new Set<string>();
    const toDelete: string[] = [];
    const groups: { original: any, duplicates: any[] }[] = [];

    // Sort by creation date (keep oldest) or id
    // We prefer keeping the one with "quiz" type if mixed, or oldest.
    questions.sort((a, b) => {
        if (a.type === 'quiz' && b.type !== 'quiz') return -1;
        if (b.type === 'quiz' && a.type !== 'quiz') return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    for (let i = 0; i < questions.length; i++) {
        const q1 = questions[i];
        if (visited.has(q1.id)) continue;

        const group = { original: q1, duplicates: [] as any[] };
        const itemsToDeleteForThisGroup: string[] = [];

        for (let j = i + 1; j < questions.length; j++) {
            const q2 = questions[j];
            if (visited.has(q2.id)) continue;

            const n1 = normalize(q1.question);
            const n2 = normalize(q2.question);

            // 1. Exact Normalized Match
            let isDuplicate = n1 === n2;

            // 2. Fuzzy Match (if length > 10 to avoid short false positives)
            if (!isDuplicate && n1.length > 10 && Math.abs(n1.length - n2.length) < 5) {
                const dist = levenshtein(n1, n2);
                // Allow small typos (distance <= 3) or high similarity ratio
                if (dist <= 3) {
                    isDuplicate = true;
                }
            }

            if (isDuplicate) {
                group.duplicates.push(q2);
                itemsToDeleteForThisGroup.push(q2.id);
                visited.add(q2.id);
            }
        }

        if (group.duplicates.length > 0) {
            groups.push(group);
            toDelete.push(...itemsToDeleteForThisGroup);
        }

        visited.add(q1.id);
    }

    console.log(`Found ${groups.length} groups of duplicates.`);
    console.log(`Total duplicates to remove: ${toDelete.length}`);

    // Generate SQL
    let sql = `-- Removing ${toDelete.length} Duplicate Questions\n`;

    if (toDelete.length > 0) {
        const ids = toDelete.map(id => `'${id}'`).join(',');
        sql += `DELETE FROM public.questions WHERE id IN (${ids});\n`;
    }

    // Log examples
    if (groups.length > 0) {
        console.log('\n--- Examples of Duplicates Found ---');
        groups.slice(0, 5).forEach(g => {
            console.log(`Original: "${g.original.question}" (${g.original.id})`);
            g.duplicates.forEach(d => console.log(`  -> Duplicate: "${d.question}" (${d.id})`));
        });
    }

    const outPath = path.resolve(__dirname, '../supabase/migrations/20251217_remove_duplicates.sql');
    fs.writeFileSync(outPath, sql);
    console.log(`Migration generated at: ${outPath}`);
}

run();
