'use client';

import { useState } from 'react';
import QuizRunner from '@/components/QuizRunner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, HelpCircle, Timer } from 'lucide-react';


export default function TesterPage() {
    const [mode, setMode] = useState<'training' | 'exam' | null>(null);

    const handleExit = () => setMode(null);

    if (mode) {
        return (
            <div className="p-4 pb-24 max-w-xl mx-auto space-y-6">
                <QuizRunner key={mode} mode={mode} onExit={handleExit} />
            </div>
        )
    }

    return (
        <div className="p-4 pb-24 max-w-xl mx-auto space-y-6 animate-enter">
            <header>
                <h1 className="text-3xl font-bold text-primary">S&apos;entraîner</h1>
                <p className="text-gray-600">Choisissez votre mode de test.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Entraînement */}
                <div>
                    <Card
                        className="cursor-pointer hover:border-primary hover:shadow-md transition-all group"
                        onClick={() => setMode('training')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Entraînement</CardTitle>
                                <CardDescription>10 questions • Correction immédiate</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                Idéal pour apprendre. Prenez votre temps, vérifiez vos réponses après chaque question et comprenez vos erreurs.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Examen */}
                <div>
                    <Card
                        className="cursor-pointer hover:border-red-500 hover:shadow-md transition-all group"
                        onClick={() => setMode('exam')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <div className="bg-red-50 p-3 rounded-full group-hover:bg-red-100 transition-colors">
                                <Timer className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <CardTitle>Examen Blanc</CardTitle>
                                <CardDescription>40 questions • 20 minutes</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                Conditions réelles. Pas de correction immédiate. Gérez votre temps pour maximiser votre score.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                    Pour réussir, vous devez obtenir au moins 24 bonnes réponses (60%) à l&apos;examen officiel. Visez 70% pour être sûr !
                </p>
            </div>
        </div>
    );
}
