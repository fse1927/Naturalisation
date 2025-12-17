
export type Difficulty = 'facile' | 'moyen' | 'difficile'; // String values in DB
export type Importance = 1 | 2 | 3; // 1: Vital, 2: Important, 3: Supplemental
export type QuestionType = 'quiz' | 'interview';

export interface Question {
    id: string;
    question: string;
    answer: string;
    options: string[];
    theme: string;
    explanation?: string;
    difficulty: Difficulty;
    importance: Importance;
    source: string; // 'Livret du Citoyen', 'Entretien', etc.
    type: QuestionType;
    created_at?: string;
    metadata?: {
        tips?: string;
        answer_tips?: string;
        required_for?: string[];
        difficulty?: string;
        [key: string]: any;
    };
}

export interface LearningContent {
    id: string;
    title: string;
    content: string;
    theme: string;
    importance: Importance;
}
