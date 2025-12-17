"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, ArrowRight, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import TextToSpeech from "@/components/TextToSpeech";
import { useInterview, InterviewQuestion } from "@/components/interview/useInterview";

interface InterviewSimulatorProps {
    userSituation?: string;
    questions: InterviewQuestion[];
}

export default function InterviewSimulator({ userSituation = 'salarié', questions }: InterviewSimulatorProps) {
    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        showAnswer,
        completed,
        nextQuestion,
        resetInterview,
        toggleAnswer,
        userResponse,
        setUserResponse,
        analyzeResponse,
        feedback
    } = useInterview(userSituation, questions);

    if (completed) {
        return (
            <div className="text-center space-y-6 py-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in zoom-in duration-300">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Entretien terminé !</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Vous avez passé en revue toutes les questions adaptées à votre profil
                    <span className="font-semibold text-primary"> ({userSituation})</span>.
                </p>
                <Button onClick={resetInterview} size="lg" className="rounded-xl">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recommencer l'entraînement
                </Button>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div className="text-center p-10 text-gray-500">Aucune question trouvée pour ce profil.</div>
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px] lg:min-h-[600px]">
            {/* Header */}
            <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-gray-900">Question {currentIndex + 1}</span>
                    <span>/ {totalQuestions}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                        {currentQuestion.category || currentQuestion.metadata?.answer_tips ? "Question" : "Général"}
                    </span>
                    {(currentQuestion as any).difficulty && (
                        <span className={`text-xs uppercase px-2 py-1 rounded font-medium
                            ${(currentQuestion as any).difficulty === 'facile' ? 'bg-green-100 text-green-700' :
                                (currentQuestion as any).difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'}`}>
                            {(currentQuestion as any).difficulty}
                        </span>
                    )}
                </div>
            </div>

            {/* ProgressBar */}
            <div className="w-full bg-gray-200 h-1">
                <div
                    className="bg-primary h-1 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            <div className="p-8 flex-1 flex flex-col space-y-6">
                <div className="flex flex-col justify-center items-center text-center space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight max-w-2xl">
                        {currentQuestion.question}
                    </h3>

                    <TextToSpeech text={currentQuestion.question} />
                </div>

                {/* User Response Area */}
                {!showAnswer && (
                    <div className="space-y-4 max-w-2xl mx-auto w-full animate-in fade-in">
                        <textarea
                            className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary resize-y text-base"
                            placeholder="Écrivez votre réponse ici ou répondez à l'oral..."
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={analyzeResponse}
                                disabled={userResponse.length < 5}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Analyser ma réponse
                            </Button>
                        </div>
                    </div>
                )}

                {/* Feedback & Answer Section */}
                {showAnswer && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {feedback && (
                            <div className={`p-4 rounded-xl border ${feedback.includes('Bien') ? 'bg-green-50 border-green-100 text-green-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                                <p className="text-sm font-medium">{feedback}</p>
                            </div>
                        )}

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-left">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">Conseil de réponse :</h4>
                                    <p className="text-blue-800 leading-relaxed text-sm whitespace-pre-line">
                                        {currentQuestion.metadata?.answer_tips || currentQuestion.answer_tips}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-50 mt-auto">
                    {!showAnswer && (
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                            onClick={toggleAnswer}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir l'aide directement
                        </Button>
                    )}

                    {showAnswer && (
                        <Button
                            className="flex-1 h-12 rounded-xl text-lg font-medium shadow-md shadow-blue-900/5"
                            onClick={nextQuestion}
                        >
                            {currentIndex === totalQuestions - 1 ? "Terminer" : "Question Suivante"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
