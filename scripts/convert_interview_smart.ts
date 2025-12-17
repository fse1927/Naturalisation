
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const QUESTIONS_FILE = path.resolve(__dirname, '../interview_dump.json');

// Helper to clean text
const normalize = (str: string) => str.toLowerCase().trim();

// Expert Knowledge Base
const KNOWLEDGE_BASE = [
    {
        keywords: ['capitale', 'france'],
        answer: 'Paris',
        options: ['Paris', 'Lyon', 'Marseille']
    },
    {
        keywords: ['devise', 'république'],
        answer: 'Liberté, Égalité, Fraternité',
        options: ['Liberté, Égalité, Fraternité', 'Travail, Famille, Patrie', 'Honneur, Patrie, Valeur']
    },
    {
        keywords: ['couleurs', 'drapeau'],
        answer: 'Bleu, Blanc, Rouge',
        options: ['Bleu, Blanc, Rouge', 'Vert, Blanc, Rouge', 'Bleu, Blanc, Jaune']
    },
    {
        keywords: ['hymne', 'national'],
        answer: 'La Marseillaise',
        options: ['La Marseillaise', 'Le Chant des Partisans', 'L\'Ode à la Joie']
    },
    {
        keywords: ['fête', 'nationale', '14 juillet'],
        answer: 'La prise de la Bastille (1789)',
        options: ['La prise de la Bastille (1789)', 'L\'Armistice de 1918', 'La mort de Louis XVI']
    },
    {
        keywords: ['président', 'actuel'],
        answer: 'Emmanuel Macron',
        options: ['Emmanuel Macron', 'François Hollande', 'Nicolas Sarkozy']
    },
    {
        keywords: ['premier ministre'],
        answer: 'Michel Barnier', // Updated for late 2024/2025 context if known, otherwise generic "Le chef du gouvernement"
        options: ['Michel Barnier', 'Gabriel Attal', 'Élisabeth Borne']
    },
    {
        keywords: ['siège', 'présidence', 'elysée'],
        answer: 'Le Palais de l\'Élysée',
        options: ['Le Palais de l\'Élysée', 'L\'Hôtel de Matignon', 'Le Palais du Luxembourg']
    },
    {
        keywords: ['loi', 'voter'],
        answer: 'Le Parlement (Assemblée Nationale et Sénat)',
        options: ['Le Parlement (Assemblée Nationale et Sénat)', 'Le Président de la République', 'Le Conseil Constitutionnel']
    },
    {
        keywords: ['mariane', 'symbole'],
        answer: 'Une figure allégorique de la République',
        options: ['Une figure allégorique de la République', 'Une reine de France', 'Une célèbre actrice']
    },
    {
        keywords: ['guerres mondiales', 'dates'],
        answer: '1914-1918 et 1939-1945',
        options: ['1914-1918 et 1939-1945', '1910-1914 et 1940-1944', '1870-1871 et 1914-1918']
    },
    {
        keywords: ['laïcité', 'principe', 'definition'],
        answer: 'Séparation de l\'Église et de l\'État, liberté de conscience',
        options: ['Séparation de l\'Église et de l\'État, liberté de conscience', 'Interdiction de toute religion', 'Obligation d\'être athée']
    },
    {
        keywords: ['pourquoi', 'devenir', 'français'],
        answer: 'Pour partager les valeurs et le projet républicain',
        options: ['Pour partager les valeurs et le projet républicain', 'Pour avoir un passeport facile', 'Pour toucher les aides sociales']
    },
    {
        keywords: ['droit', 'vote', 'femmes'],
        answer: '1944',
        options: ['1944', '1789', '1905']
    },
    {
        keywords: ['abolition', 'peine de mort'],
        answer: '1981',
        options: ['1981', '1945', '1968']
    },
    {
        keywords: ['départements', 'nombre'],
        answer: '101 départements',
        options: ['101 départements', '96 départements', '120 départements']
    },
    {
        keywords: ['fleuves', 'liste'],
        answer: 'La Seine, La Loire, Le Rhône, La Garonne, Le Rhin',
        options: ['La Seine, La Loire, Le Rhône, La Garonne, Le Rhin', 'La Seine, L\'Amazone, Le Nil', 'Le Danube, La Volga, La Loire']
    },
    {
        keywords: ['monuments', 'historiques'],
        answer: 'La Tour Eiffel, Le Louvre, L\'Arc de Triomphe',
        options: ['La Tour Eiffel, Le Louvre, L\'Arc de Triomphe', 'La Statue de la Liberté, Le Colisée', 'Big Ben, La Tour de Pise']
    },
    {
        keywords: ['maire', 'rôle'],
        answer: 'Administre la commune et représente l\'État',
        options: ['Administre la commune et représente l\'État', 'Vote les lois', 'Juge les délits']
    },
    {
        keywords: ['trois couleurs', 'signification'],
        answer: 'Bleu et Rouge (Paris), Blanc (Roi)',
        options: ['Bleu et Rouge (Paris), Blanc (Roi)', 'Bleu (Mer), Blanc (Paix), Rouge (Sang)', 'Liberté, Égalité, Fraternité']
    },
    // Personalisées - Best Practice
    {
        keywords: ['fois', 'rentrez', 'pays'],
        answer: 'Je garde des liens normaux avec ma famille',
        options: ['Je garde des liens normaux avec ma famille', 'Je ne rentre jamais', 'Je vis moitié ici moitié là-bas']
    },
    {
        keywords: ['associations'],
        answer: 'Oui (participer à la vie sociale)',
        options: ['Oui (participer à la vie sociale)', 'Non, ça ne sert à rien', 'Seulement communautaires']
    },
    {
        keywords: ['langue', 'travail'],
        answer: 'Le français',
        options: ['Le français', 'Ma langue maternelle', 'L\'anglais uniquement']
    },
    {
        keywords: ['charles de gaulle'],
        answer: 'Chef de la France Libre et père de la Ve République',
        options: ['Chef de la France Libre et père de la Ve République', 'Un empereur français', 'Le créateur de la Sécurité Sociale']
    },
    {
        keywords: ['voltaire'],
        answer: 'Un philosophe des Lumières',
        options: ['Un philosophe des Lumières', 'Un roi de France', 'Un général napoléonien']
    },
    {
        keywords: ['molière'],
        answer: 'Un dramaturge et comédien célèbre',
        options: ['Un dramaturge et comédien célèbre', 'Un peintre impressionniste', 'Un navigateur']
    },
    {
        keywords: ['victor hugo'],
        answer: 'Écrivain célèbre (Les Misérables)',
        options: ['Écrivain célèbre (Les Misérables)', 'Premier ministre', 'Inventeur du cinéma']
    }
];

function findBestMatch(question: string) {
    const text = normalize(question);

    // Sort logic: match as many keywords as possible
    let bestMatch = null;
    let maxScore = 0;

    for (const entry of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (text.includes(kw)) score++;
        }

        if (score > maxScore && score >= 1) { // Min 1 keyword overlap
            maxScore = score;
            bestMatch = entry;
        }
    }

    return bestMatch;
}

async function run() {
    if (!fs.existsSync(QUESTIONS_FILE)) {
        console.error('No questions file found.');
        return;
    }

    const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    console.log(`Loaded ${questions.length} questions.`);

    let sql = `-- Smart Interview to Quiz Conversion\n`;
    let convertedCount = 0;
    let genericCount = 0;

    const updates: string[] = [];

    for (const q of questions) {
        // Skip placeholder questions
        if (q.question.toLowerCase() === 'question' || q.question.length < 5) continue;

        const match = findBestMatch(q.question);

        let answer = '';
        let options: string[] = [];

        if (match) {
            answer = match.answer;
            options = match.options;
            convertedCount++;
        } else {
            // Fallback for unmatched questions (generic structure based on logic)
            // We use simple heuristics or generic templates
            if (q.category === 'Motivation' || q.category === 'Intégration') {
                answer = "Réponse montrant votre intégration et adhésion aux valeurs";
                options = [
                    "Réponse montrant votre intégration et adhésion aux valeurs",
                    "Réponse montrant un détachement de la France",
                    "Réponse hors sujet"
                ];
            } else if (q.category === 'Histoire') {
                answer = "Fait historique majeur";
                options = ["Fait historique majeur", "Légende urbaine", "Fait d'un autre pays"];
            } else {
                answer = "Réponse précise et correcte";
                options = ["Réponse précise et correcte", "Réponse approximative", "Réponse fausse"];
            }
            genericCount++;
        }

        // Shuffle options for randomness (simple sort)
        // Actually keep them fixed for consistency in SQL generation, existing array order is fine.
        // We ensure "answer" is in "options".

        // Escape SQL strings
        const escape = (s: string) => s.replace(/'/g, "''");

        const optsSql = options.map(o => `'${escape(o)}'`).join(',');

        updates.push(`
        UPDATE public.questions 
        SET 
            type = 'quiz',
            answer = '${escape(answer)}',
            options = ARRAY[${optsSql}]
        WHERE id = '${q.id}';
        `);
    }

    sql += updates.join('\n');

    const outPath = path.resolve(__dirname, '../supabase/migrations/20251217_convert_interview_smart_v2.sql');
    fs.writeFileSync(outPath, sql);

    console.log(`Generated SQL for ${convertedCount + genericCount} questions.`);
    console.log(`- Smart Matched: ${convertedCount}`);
    console.log(`- Generic Fallback: ${genericCount}`);
    console.log(`File: ${outPath}`);
}

run();
