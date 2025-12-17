'use client'

import { useEffect } from 'react'
import { QuizMode } from '@/components/quiz/types'
import { useQuiz } from '@/components/quiz/useQuiz'
import { QuizLoading } from '@/components/quiz/QuizLoading'
import { QuizResults } from '@/components/quiz/QuizResults'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'

interface QuizRunnerProps {
    mode: QuizMode;
    onExit: () => void;
}

export default function QuizRunner({ mode, onExit }: QuizRunnerProps) {
    const { state, startQuiz, selectAnswer, validateOrNext, exitQuiz } = useQuiz(mode);

    // Auto-start
    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    if (state.status === 'loading' || state.status === 'idle') {
        return <QuizLoading mode={mode} />;
    }

    if (state.status === 'finished') {
        const timeSpent = Math.floor((state.endTime - state.startTime) / 1000);
        return (
            <QuizResults
                mode={mode}
                score={state.score}
                totalQuestions={state.questions.length}
                timeSpent={timeSpent}
                onExit={onExit}
            />
        );
    }

    const currentQuestion = state.questions[state.currentIndex];
    if (!currentQuestion) return null;

    return (
        <QuizQuestion
            question={currentQuestion}
            currentIndex={state.currentIndex}
            totalQuestions={state.questions.length}
            mode={mode}
            shuffledOptions={state.shuffledOptions}
            selectedAnswer={state.selectedAnswer}
            isAnswerChecked={state.isAnswerChecked}
            timeRemaining={state.timeRemaining}
            onSelectAnswer={selectAnswer}
            onValidateOrNext={validateOrNext}
            onExit={onExit}
        />
    );
}
