import { Timer, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/data/types';
import { QuizMode } from './types';

interface QuizQuestionProps {
    question: Question;
    currentIndex: number;
    totalQuestions: number;
    mode: QuizMode;
    shuffledOptions: string[];
    selectedAnswer: string | null;
    isAnswerChecked: boolean;
    timeRemaining: number;
    onSelectAnswer: (answer: string) => void;
    onValidateOrNext: () => void;
    onExit: () => void;
}

export function QuizQuestion({
    question,
    currentIndex,
    totalQuestions,
    mode,
    shuffledOptions,
    selectedAnswer,
    isAnswerChecked,
    timeRemaining,
    onSelectAnswer,
    onValidateOrNext,
    onExit
}: QuizQuestionProps) {

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[60vh]">
            {/* Header / Timer */}
            <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-gray-900">Question {currentIndex + 1}</span>
                    <span>/ {totalQuestions}</span>
                </div>
                {mode === 'exam' && (
                    <div className={`flex items-center gap-2 font-mono font-bold ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-primary'}`}>
                        <Timer className="w-5 h-5" />
                        {formatTime(timeRemaining)}
                    </div>
                )}
                {mode === 'training' && (
                    <span className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {question.theme}
                    </span>
                )}
            </div>

            {/* ProgressBar */}
            <div className="w-full bg-gray-200 h-1">
                <div
                    className="bg-primary h-1 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 leading-snug min-h-[4rem]">
                    {question.question}
                </h3>

                <div className="space-y-3 flex-1">
                    {shuffledOptions.length > 0 ? (
                        shuffledOptions.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === question.answer;

                            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ";

                            if (mode === 'training' && isAnswerChecked) {
                                if (isCorrect) {
                                    btnClass += "border-green-500 bg-green-50 text-green-700 cursor-default";
                                } else if (isSelected) {
                                    btnClass += "border-red-500 bg-red-50 text-red-700 cursor-default";
                                } else {
                                    btnClass += "border-gray-100 text-gray-400 opacity-50 cursor-default";
                                }
                            } else {
                                if (isSelected) {
                                    btnClass += "border-primary bg-blue-50 text-primary ring-2 ring-primary ring-opacity-20";
                                } else {
                                    btnClass += "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700 active:scale-[0.99]";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => onSelectAnswer(option)}
                                    disabled={isAnswerChecked && mode === 'training'}
                                    className={btnClass}
                                >
                                    <span className="text-lg">{option}</span>
                                    {mode === 'training' && isAnswerChecked && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                                    {mode === 'training' && isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="italic text-gray-500 text-center">Question ouverte (Pas d'options).</p>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-between items-center mt-auto">
                    <Button variant="ghost" size="sm" onClick={onExit} className="text-gray-400 hover:text-red-500">
                        Quitter
                    </Button>

                    <button
                        onClick={onValidateOrNext}
                        disabled={!selectedAnswer && (mode === 'exam' || !isAnswerChecked) && shuffledOptions.length > 0}
                        className={`py-3 px-8 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 ${(!selectedAnswer && !isAnswerChecked && shuffledOptions.length > 0)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0'
                            }`}
                    >
                        {!isAnswerChecked && mode === 'training' ? 'Valider' : (currentIndex < totalQuestions - 1 ? 'Suivant' : 'Terminer')}
                    </button>
                </div>
            </div>
        </div>
    );
}
