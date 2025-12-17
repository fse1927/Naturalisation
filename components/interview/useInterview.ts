import { useState, useMemo, useCallback } from "react";

// Assuming Question type is compatible or using generic any for now, but better to use defined type
import { Question } from "@/lib/data/types"; // This might need update to match migrated questions

export type InterviewQuestion = {
    id: string;
    question: string;
    // Normalized fields from DB
    metadata?: {
        answer_tips?: string;
        required_for?: string[];
    };
    category?: string; // or theme
    // fallback for legacy static questions
    answer_tips?: string;
};

export function useInterview(userSituation: string = 'salarié', initialQuestions: InterviewQuestion[] = []) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Response Analysis State
    const [userResponse, setUserResponse] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);

    // If questions are passed (sorted from server), use them. 
    // Otherwise fallback (legacy) - but we aim to remove legacy.
    const questions = initialQuestions;

    const currentQuestion = questions[currentIndex];

    const nextQuestion = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
            setUserResponse("");
            setFeedback(null);
        } else {
            setCompleted(true);
        }
    }, [currentIndex, questions.length]);

    const resetInterview = useCallback(() => {
        setCurrentIndex(0);
        setShowAnswer(false);
        setCompleted(false);
        setUserResponse("");
        setFeedback(null);
    }, []);

    const toggleAnswer = useCallback(() => {
        setShowAnswer(prev => !prev);
    }, []);

    const analyzeResponse = useCallback(() => {
        if (!currentQuestion) return;

        const tips = currentQuestion.metadata?.answer_tips || currentQuestion.answer_tips || "";
        const userAnswer = userResponse.toLowerCase();

        // Simple keyword matching simulation
        // Extract meaningful words from tips (length > 4) to check if user mentioned them
        const keywords = tips.toLowerCase().match(/\w{5,}/g) || [];
        const matches = keywords.filter(word => userAnswer.includes(word));

        const matchPercentage = keywords.length > 0 ? (matches.length / keywords.length) : 0;

        if (matchPercentage > 0.3) {
            setFeedback("Bien ! Votre réponse semble contenir des éléments clés attendus.");
        } else if (userAnswer.length > 10) {
            setFeedback("Votre réponse est peut-être un peu courtaud ou manque de mots-clés spécifiques. Regardez les conseils !");
        } else {
            setFeedback("Essayez de développer votre réponse.");
        }

        setShowAnswer(true); // Show tips after analysis
    }, [currentQuestion, userResponse]);

    return {
        currentQuestion,
        currentIndex,
        totalQuestions: questions.length,
        showAnswer,
        completed,
        nextQuestion,
        resetInterview,
        toggleAnswer,
        userResponse,
        setUserResponse,
        analyzeResponse,
        feedback
    };
}
