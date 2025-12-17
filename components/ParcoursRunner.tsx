'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import Link from 'next/link';

// Types
import { Question } from '@/lib/types';

// Actions
import { markQuestionAsLearned } from '@/lib/actions/user-progress';

type ParcoursRunnerProps = {
    initialQuestions: Question[];
    level: string;
};

export default function ParcoursRunner({ initialQuestions, level }: ParcoursRunnerProps) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [progress, setProgress] = useState(0);

    const currentQuestion = questions[currentIndex];

    const handleSelectAnswer = (answer: string) => {
        if (isAnswerChecked) return;
        setSelectedAnswer(answer);
    };

    const handleCheckAnswer = async () => {
        if (!selectedAnswer || isAnswerChecked) return;

        const correct = selectedAnswer === currentQuestion.reponse_correcte;
        setIsCorrect(correct);
        setIsAnswerChecked(true);

        if (correct) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            await markQuestionAsLearned(currentQuestion.id);
            setProgress(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            // End of current session
            // Could redirect to parcours page
        }
    };

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in fade-in">
                <Trophy className="w-20 h-20 text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800">C'est terminé pour cette session !</h2>
                <p className="text-gray-600 max-w-md">
                    Vous avez complété cette série de questions pour le niveau <span className="capitalize font-bold">{level}</span>.
                </p>
                <Link href="/parcours">
                    <Button size="lg" className="font-bold">
                        Retour au Parcours
                    </Button>
                </Link>
            </div>
        );
    }

    const options = [currentQuestion.reponse_correcte, ...(currentQuestion.autres_reponses_fausses || [])].filter(Boolean).sort();

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="capitalize">{level}</span>
                </div>
                <div>
                    Question {currentIndex + 1} / {questions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6 md:p-8 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                            {currentQuestion.question}
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {options.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectOption = option === currentQuestion.reponse_correcte;

                            let variant = "bg-white border-gray-200 hover:border-primary/50 hover:bg-gray-50";

                            if (isAnswerChecked) {
                                if (isCorrectOption) {
                                    variant = "bg-green-50 border-green-500 text-green-700 font-medium";
                                } else if (isSelected && !isCorrect) {
                                    variant = "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    variant = "bg-gray-50 border-gray-100 text-gray-400 opacity-70";
                                }
                            } else if (isSelected) {
                                variant = "bg-primary/5 border-primary text-primary font-medium ring-1 ring-primary";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectAnswer(option)}
                                    disabled={isAnswerChecked}
                                    className={cn(
                                        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group",
                                        variant
                                    )}
                                >
                                    <span>{option}</span>
                                    {isAnswerChecked && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Footer / Actions */}
            <div className="flex justify-end pt-4">
                {!isAnswerChecked ? (
                    <Button
                        size="lg"
                        onClick={handleCheckAnswer}
                        disabled={!selectedAnswer}
                        className="px-8 font-bold shadow-md"
                    >
                        Valider
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className={cn(
                            "px-8 font-bold shadow-md",
                            isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                        )}
                    >
                        {currentIndex < questions.length - 1 ? "Question Suivante" : "Terminer"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
                {isAnswerChecked && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "p-4 rounded-xl text-center font-medium",
                            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}
                    >
                        {isCorrect ? "Bravo ! Réponse correcte." : "Oups ! Ce n'est pas la bonne réponse."}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
