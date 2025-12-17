
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Spare questions to replace "question" placeholders
const SPARE_QUESTIONS = [
    {
        question: "Quelle est la date de la fête nationale ?",
        answer: "14 juillet",
        options: ["14 juillet", "1 mai", "11 novembre"],
        theme: "Histoire"
    },
    {
        question: "Qui a écrit Les Misérables ?",
        answer: "Victor Hugo",
        options: ["Victor Hugo", "Émile Zola", "Molière"],
        theme: "Culture"
    },
    {
        question: "Quel est le plus haut sommet de France ?",
        answer: "Le Mont Blanc",
        options: ["Le Mont Blanc", "Le Pic du Midi", "Le Puy de Dôme"],
        theme: "Géographie"
    },
    {
        question: "En quelle année l'euro a-t-il remplacé le franc ?",
        answer: "2002",
        options: ["2002", "2000", "1998"],
        theme: "Histoire"
    },
    {
        question: "Combien de régions compte la France métropolitaine ?",
        answer: "13",
        options: ["13", "22", "96"],
        theme: "Géographie"
    },
    {
        question: "Qui habite au Palais de l'Élysée ?",
        answer: "Le Président de la République",
        options: ["Le Président de la République", "Le Premier Ministre", "Le roi"],
        theme: "Institutions"
    },
    {
        question: "Quelle est la devise de Paris ?",
        answer: "Fluctuat nec mergitur",
        options: ["Fluctuat nec mergitur", "Liberté, Égalité, Fraternité", "Droit et devoir"],
        theme: "Culture"
    },
    {
        question: "Quel monument se trouve au centre de la place de l'Étoile ?",
        answer: "L'Arc de Triomphe",
        options: ["L'Arc de Triomphe", "La Tour Eiffel", "Le Panthéon"],
        theme: "Culture"
    },
    {
        question: "Comment s'appelle l'hymne national ?",
        answer: "La Marseillaise",
        options: ["La Marseillaise", "Le Chant du Départ", "L'Internationale"],
        theme: "Symboles"
    },
    {
        question: "Qui a le pouvoir législatif ?",
        answer: "Le Parlement",
        options: ["Le Parlement", "Le Gouvernement", "Le Président"],
        theme: "Institutions"
    },
    {
        question: "Quelle est la monnaie de la France ?",
        answer: "L'Euro",
        options: ["L'Euro", "Le Franc", "Le Dollar"],
        theme: "Europe"
    },
    {
        question: "Où siège le Parlement européen ?",
        answer: "Strasbourg",
        options: ["Strasbourg", "Bruxelles", "Paris"],
        theme: "Europe"
    },
    {
        question: "Qui est le chef des armées ?",
        answer: "Le Président de la République",
        options: ["Le Président de la République", "Le Ministre de la Défense", "Le Chef d'État-Major"],
        theme: "Institutions"
    },
    {
        question: "En quelle année a été signée la Déclaration des Droits de l'Homme ?",
        answer: "1789",
        options: ["1789", "1948", "1958"],
        theme: "Histoire"
    },
    {
        question: "Quel fleuve traverse Paris ?",
        answer: "La Seine",
        options: ["La Seine", "La Loire", "Le Rhône"],
        theme: "Géographie"
    }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
    console.log('Fetching junk questions...');

    // Find questions that are just "question" or very short
    const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .or('question.eq.question,question.eq.Question,question.eq.jestion')
        .eq('type', 'interview');

    if (error || !questions) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${questions.length} junk questions to recycle.`);

    let sql = `-- Recycling Junk Questions into Valid Quizzes\n`;
    let usedSpareIndex = 0;

    for (const q of questions) {
        if (usedSpareIndex >= SPARE_QUESTIONS.length) {
            // Cycle through them if we have more junk than spares, 
            // or just leave them. (Cycling is better than leaving junk)
            usedSpareIndex = 0;
        }

        const spare = SPARE_QUESTIONS[usedSpareIndex];
        const escape = (s: string) => s.replace(/'/g, "''");

        const optsSql = spare.options.map(o => `'${escape(o)}'`).join(',');

        sql += `
        UPDATE public.questions 
        SET 
            type = 'quiz',
            question = '${escape(spare.question)}',
            answer = '${escape(spare.answer)}',
            options = ARRAY[${optsSql}],
            theme = '${escape(spare.theme)}'
        WHERE id = '${q.id}';
        `;

        usedSpareIndex++;
    }

    const outPath = path.resolve(__dirname, '../supabase/migrations/20251217_recycle_junk.sql');
    fs.writeFileSync(outPath, sql);

    console.log(`Generated SQL to recycle ${questions.length} questions.`);
    console.log(`File: ${outPath}`);
}

run();
