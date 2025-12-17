import { Question } from '@/lib/data/types';

export type QuizStatus = 'idle' | 'loading' | 'running' | 'finished';
export type QuizMode = 'training' | 'exam';

export interface QuizState {
    questions: Question[];
    currentIndex: number;
    status: QuizStatus;
    score: number;
    startTime: number;
    endTime: number;
    shuffledOptions: string[];
    selectedAnswer: string | null;
    isAnswerChecked: boolean;
    missedQuestions: string[]; // Changed from number[] to string[] to support string IDs
    timeRemaining: number;
}
