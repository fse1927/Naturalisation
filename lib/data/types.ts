
export type Difficulty = 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
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
}

export interface LearningContent {
    id: string;
    title: string;
    content: string;
    theme: string;
    importance: Importance;
}
