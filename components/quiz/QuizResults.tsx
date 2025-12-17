import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QuizMode } from './types';

interface QuizResultsProps {
    mode: QuizMode;
    score: number;
    totalQuestions: number;
    timeSpent: number; // in seconds
    onExit: () => void;
}

export function QuizResults({ mode, score, totalQuestions, timeSpent, onExit }: QuizResultsProps) {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPass = percentage >= 70;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'exam' ? 'Examen Terminé !' : 'Test Terminé !'}
            </h2>

            <div className="flex justify-center">
                <div className={`text-6xl font-extrabold ${percentage >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                    {percentage}%
                </div>
            </div>

            {mode === 'exam' && (
                <div className={`text-xl font-bold ${isPass ? 'text-green-600' : 'text-red-500'}`}>
                    {isPass ? 'SUCCÈS' : 'ÉCHEC'}
                </div>
            )}

            <p className="text-gray-600 text-lg">
                Vous avez répondu correctement à <strong>{score}</strong> sur <strong>{totalQuestions}</strong> questions en {timeSpent} secondes.
            </p>

            <div className="flex gap-4 justify-center pt-4">
                <Button onClick={onExit} variant="outline" size="lg">
                    Retour au menu
                </Button>
                <Link
                    href="/profil"
                    className="bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center"
                >
                    Voir mon historique
                </Link>
            </div>
        </div>
    );
}
