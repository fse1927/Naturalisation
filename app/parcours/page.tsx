import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, CheckCircle, Star, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserProgressList } from '@/lib/actions/user-progress';

export default async function ParcoursPage() {
    const supabase = await createClient();

    // Fetch all questions
    const { data: questions } = await supabase
        .from('questions')
        .select('id, difficulty, question')
        .order('created_at');

    // Fetch user progress
    const learnedIds = await getUserProgressList();

    const levels = ['facile', 'moyen', 'difficile'];
    const levelLabels = {
        'facile': 'Débutant',
        'moyen': 'Intermédiaire',
        'difficile': 'Expert'
    };

    const levelStats = levels.map(level => {
        const levelQuestions = questions?.filter(q => (q.difficulty || 'moyen') === level) || [];
        const total = levelQuestions.length;
        const completed = levelQuestions.filter(q => learnedIds.includes(q.id)).length;
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            level,
            label: levelLabels[level as keyof typeof levelLabels],
            total,
            completed,
            progress: progressPercent,
            isLocked: false // Logic could be: lock Medium until Easy > 50%
        };
    });

    // Simple lock logic: Lock Medium if Easy < 50%
    if (levelStats[0].progress < 50) levelStats[1].isLocked = true;
    if (levelStats[1].progress < 50 || levelStats[1].isLocked) levelStats[2].isLocked = true;

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Parcours d'Apprentissage
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Progressez étape par étape. Validez chaque niveau pour débloquer le suivant et maîtriser tous les sujets de la naturalisation.
                </p>
            </header>

            <div className="grid gap-6">
                {levelStats.map((stat, index) => (
                    <div
                        key={stat.level}
                        className={cn(
                            "relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all",
                            stat.isLocked ? "opacity-75 grayscale" : "hover:shadow-lg border-blue-100"
                        )}
                    >
                        {stat.isLocked && (
                            <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-gray-500 font-bold border">
                                    <Trophy className="w-5 h-5 text-gray-400" />
                                    Niveau Verrouillé
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                                stat.level === 'facile' ? "bg-green-100 text-green-600" :
                                    stat.level === 'moyen' ? "bg-blue-100 text-blue-600" :
                                        "bg-purple-100 text-purple-600"
                            )}>
                                {stat.progress >= 100 ? (
                                    <CheckCircle className="w-10 h-10" />
                                ) : (
                                    <span className="text-2xl font-bold">{stat.progress}%</span>
                                )}
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h2 className="text-2xl font-bold capitalize">{stat.label}</h2>
                                    {stat.progress >= 100 && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                                </div>
                                <p className="text-gray-500">
                                    {stat.completed} sur {stat.total} fiches maîtrisées
                                </p>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000",
                                            stat.level === 'facile' ? "bg-green-500" :
                                                stat.level === 'moyen' ? "bg-blue-500" :
                                                    "bg-purple-600"
                                        )}
                                        style={{ width: `${stat.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="shrink-0">
                                <Link href={stat.isLocked ? '#' : `/apprendre?difficulty=${stat.level}`}>
                                    <Button
                                        size="lg"
                                        disabled={stat.isLocked}
                                        className={cn(
                                            "min-w-[150px] font-bold shadow-md",
                                            stat.isLocked ? "bg-gray-200 text-gray-400" :
                                                stat.level === 'facile' ? "bg-green-600 hover:bg-green-700" :
                                                    stat.level === 'moyen' ? "bg-blue-600 hover:bg-blue-700" :
                                                        "bg-purple-600 hover:bg-purple-700"
                                        )}
                                    >
                                        {stat.progress === 0 ? "Commencer" :
                                            stat.progress >= 100 ? "Réviser" : "Continuer"}
                                        {!stat.isLocked && <ArrowRight className="w-4 h-4 ml-2" />}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
