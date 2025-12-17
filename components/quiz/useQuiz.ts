import { useState, useCallback, useEffect, useRef } from 'react';
import { Question } from '@/lib/data/types';
import { getRandomQuizQuestions } from '@/lib/actions/questions'; // Server action
import { saveQuizResult } from '@/app/tester/actions';
import { QuizMode, QuizState } from './types';

export function useQuiz(mode: QuizMode) {
    const [state, setState] = useState<QuizState>({
        questions: [],
        currentIndex: 0,
        status: 'idle',
        score: 0,
        startTime: 0,
        endTime: 0,
        shuffledOptions: [],
        selectedAnswer: null,
        isAnswerChecked: false,
        missedQuestions: [],
        timeRemaining: 20 * 60,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Helper to finish quiz
    const finishQuiz = useCallback(async () => {
        const end = Date.now();
        setState(prev => ({ ...prev, endTime: end, status: 'finished' }));

        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    // Effect to save when finished
    useEffect(() => {
        if (state.status === 'finished' && state.startTime > 0) {
            const timeInSeconds = Math.floor((state.endTime - state.startTime) / 1000);
            const finalScorePourcentage = state.questions.length > 0
                ? Math.round((state.score / state.questions.length) * 100)
                : 0;

            saveQuizResult(finalScorePourcentage, timeInSeconds, state.missedQuestions)
                .catch(e => console.error("Failed to save result", e));
        }
    }, [state.status, state.startTime, state.endTime, state.score, state.questions.length, state.missedQuestions]);

    const startQuiz = useCallback(async () => {
        setState(prev => ({ ...prev, status: 'loading' }));
        try {
            const limit = mode === 'exam' ? 40 : 10;
            const data = await getRandomQuizQuestions(limit);

            if (!data || data.length === 0) {
                alert("Aucune question disponible.");
                setState(prev => ({ ...prev, status: 'idle' }));
                return;
            }

            const initialQuestion = data[0];
            const options = Array.from(new Set([initialQuestion.answer, ...initialQuestion.options]));
            const shuffled = options.sort(() => 0.5 - Math.random());

            setState({
                questions: data,
                currentIndex: 0,
                status: 'running',
                score: 0,
                startTime: Date.now(),
                endTime: 0,
                shuffledOptions: shuffled,
                selectedAnswer: null,
                isAnswerChecked: false,
                missedQuestions: [],
                timeRemaining: mode === 'exam' ? 20 * 60 : 0
            });

        } catch (error) {
            console.error(error);
            setState(prev => ({ ...prev, status: 'idle' }));
        }
    }, [mode]);

    const selectAnswer = (answer: string) => {
        if (state.isAnswerChecked && mode === 'training') return;
        setState(prev => ({ ...prev, selectedAnswer: answer }));
    };

    const nextQuestion = useCallback(() => {
        if (state.currentIndex < state.questions.length - 1) {
            const nextIndex = state.currentIndex + 1;
            const nextQ = state.questions[nextIndex];
            // Prepare next question logic
            const options = Array.from(new Set([nextQ.answer, ...nextQ.options]));
            const shuffled = options.sort(() => 0.5 - Math.random());

            setState(prev => ({
                ...prev,
                currentIndex: nextIndex,
                shuffledOptions: shuffled,
                selectedAnswer: null,
                isAnswerChecked: false
            }));
        } else {
            finishQuiz();
        }
    }, [state.currentIndex, state.questions, finishQuiz]);

    const checkAnswer = useCallback(() => {
        if (!state.selectedAnswer) return;

        const currentQuestion = state.questions[state.currentIndex];
        const isCorrect = state.selectedAnswer === currentQuestion.answer;

        setState(prev => ({
            ...prev,
            score: isCorrect ? prev.score + 1 : prev.score,
            missedQuestions: isCorrect ? prev.missedQuestions : [...prev.missedQuestions, currentQuestion.id],
            isAnswerChecked: true
        }));

        if (mode === 'exam') {
            // Handled in validateOrNext mostly
        }
    }, [state.selectedAnswer, state.questions, state.currentIndex, mode]);

    // Timer effect
    useEffect(() => {
        if (state.status === 'running' && mode === 'exam') {
            timerRef.current = setInterval(() => {
                setState(prev => {
                    if (prev.timeRemaining <= 1) {
                        finishQuiz();
                        return { ...prev, timeRemaining: 0 };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.status, mode, finishQuiz]);


    // Helper for confirming answer to handle Exam auto-advance vs Training manual check
    const validateOrNext = useCallback(() => {
        if (mode === 'training') {
            if (state.isAnswerChecked) {
                nextQuestion();
            } else {
                checkAnswer();
            }
        } else {
            // Exam mode
            // We need to validate AND move to next
            setState(prev => {
                const currentQuestion = prev.questions[prev.currentIndex];
                const isCorrect = prev.selectedAnswer === currentQuestion.answer;
                const newScore = isCorrect ? prev.score + 1 : prev.score;
                const newMissed = isCorrect ? prev.missedQuestions : [...prev.missedQuestions, currentQuestion.id];

                if (prev.currentIndex < prev.questions.length - 1) {
                    const nextIndex = prev.currentIndex + 1;
                    const nextQ = prev.questions[nextIndex];
                    const options = Array.from(new Set([nextQ.answer, ...nextQ.options]));

                    return {
                        ...prev,
                        score: newScore,
                        missedQuestions: newMissed,
                        currentIndex: nextIndex,
                        shuffledOptions: options.sort(() => 0.5 - Math.random()),
                        selectedAnswer: null,
                        isAnswerChecked: false
                    };
                } else {
                    // Finish
                    const end = Date.now();
                    return {
                        ...prev,
                        score: newScore,
                        missedQuestions: newMissed,
                        status: 'finished',
                        endTime: end
                    };
                }
            });
        }
    }, [mode, state.isAnswerChecked, checkAnswer, nextQuestion]);

    return {
        state,
        startQuiz,
        selectAnswer,
        validateOrNext,
        exitQuiz: () => setState(prev => ({ ...prev, status: 'idle' })) // Simple reset
    };
}
