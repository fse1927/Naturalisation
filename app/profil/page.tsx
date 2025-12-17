import { getUserProfile, updateUserProfile } from './actions';
import { getGlobalProgress } from '@/lib/actions/user-progress';
import { signout } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Activity, LogOut, Settings, Award } from 'lucide-react';
import { redirect } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { HistoryChart } from '@/components/profile/HistoryChart';
import FadeIn from '@/components/motion/FadeIn';

export const dynamic = 'force-dynamic';

export default async function ProfilPage() {
    const data = await getUserProfile();
    const globalProgress = await getGlobalProgress();

    if (!data) {
        redirect('/login');
    }

    const { user, stats } = data;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 dark:bg-gray-950 p-4 pb-32 max-w-2xl mx-auto space-y-8">
            <header className="flex items-center justify-between sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-gray-200/50 dark:border-gray-800/50 transition-all">
                {/* ... existing header content ... */}
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mon Profil</h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gérez votre progression et vos paramètres.</p>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <form action={signout}>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="sr-only">Se déconnecter</span>
                        </Button>
                    </form>
                </div>
            </header>

            {/* User Info Card */}
            <FadeIn delay={0.1}>
                <Card className="dark:bg-slate-900 dark:border-slate-800 border-none shadow-md overflow-hidden relative">
                    {/* ... existing card content ... */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-400"></div>
                    <CardHeader className="flex flex-row items-center gap-5 pb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl dark:from-blue-900/20 dark:to-blue-800/20 shadow-inner">
                            <User className="w-8 h-8 text-primary dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-xl dark:text-white">{user.nom_prenom || 'Apprenant'}</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
                            {user.profil_situation && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-100 dark:border-blue-800/50 mt-1">
                                    {user.profil_situation}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 dark:bg-slate-950/50 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                            <form action={updateUserProfile} className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 dark:text-gray-300">
                                    <Settings className="w-4 h-4 text-gray-400" />
                                    Mettre à jour mes informations
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-[1fr,1fr,auto]">
                                    <input
                                        name="nom_prenom"
                                        defaultValue={user.nom_prenom || ''}
                                        placeholder="Nom Prénom"
                                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-500/20"
                                    />
                                    <select
                                        name="profil_situation"
                                        defaultValue={user.profil_situation || ''}
                                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-500/20"
                                    >
                                        <option value="">Situation...</option>
                                        <option value="Célibataire">Célibataire</option>
                                        <option value="Marié(e)">Marié(e)</option>
                                        <option value="Étudiant(e)">Étudiant(e)</option>
                                        <option value="Employé(e)">Employé(e)</option>
                                    </select>
                                    <Button type="submit" size="sm" className="h-10 px-6 font-semibold shadow-sm hover:shadow active:scale-95 transition-all">
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>

            {/* Global Progress Bar */}
            <FadeIn delay={0.2}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">Progression Globale</h3>
                        <span className="text-sm font-bold text-primary">{globalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 dark:bg-gray-800 overflow-hidden">
                        <div
                            className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${globalProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">Apprentissage du contenu</p>
                </div>
            </FadeIn>

            {/* Stats Grid */}
            <FadeIn delay={0.3}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:border-green-200 hover:shadow-green-100/50 transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-green-900/30">
                        <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/30 mb-1">
                            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {stats.totalTests}
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tests Réalisés</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:border-orange-200 hover:shadow-orange-100/50 transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-orange-900/30">
                        <div className="bg-orange-100 p-3 rounded-full dark:bg-orange-900/30 mb-1">
                            <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {Math.round(stats.avgScore)}<span className="text-lg text-gray-400">%</span>
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Moyen</span>
                    </div>
                </div>
            </FadeIn>

            {/* History Chart */}
            {stats.history && stats.history.length > 0 && (
                <FadeIn delay={0.4}>
                    <HistoryChart history={stats.history} />
                </FadeIn>
            )}

            {/* Badges Section */}
            <FadeIn delay={0.5}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-slate-900 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 dark:text-white">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Mes Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Badge 1 */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${stats.totalTests >= 1 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30 scale-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 grayscale opacity-60 dark:bg-slate-800/50 dark:border-slate-800'}`}>
                            <div className="text-3xl filter drop-shadow-sm">🌱</div>
                            <p className={`text-xs font-bold ${stats.totalTests >= 1 ? 'text-yellow-800 dark:text-yellow-500' : 'text-gray-400'}`}>Débutant</p>
                        </div>

                        {/* Badge 2 */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${stats.totalTests >= 5 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30 scale-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 grayscale opacity-60 dark:bg-slate-800/50 dark:border-slate-800'}`}>
                            <div className="text-3xl filter drop-shadow-sm">📚</div>
                            <p className={`text-xs font-bold ${stats.totalTests >= 5 ? 'text-blue-800 dark:text-blue-400' : 'text-gray-400'}`}>Assidu</p>
                        </div>

                        {/* Badge 3 */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${stats.avgScore >= 80 && stats.totalTests >= 1 ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-900/30 scale-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 grayscale opacity-60 dark:bg-slate-800/50 dark:border-slate-800'}`}>
                            <div className="text-3xl filter drop-shadow-sm">🎓</div>
                            <p className={`text-xs font-bold ${stats.avgScore >= 80 ? 'text-purple-800 dark:text-purple-400' : 'text-gray-400'}`}>Expert</p>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
