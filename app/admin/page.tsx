import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, FileQuestion, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch stats
    const { count: userCount } = await supabase.from('utilisateurs').select('id', { count: 'exact', head: true });
    const { count: questionCount } = await supabase.from('questions').select('id', { count: 'exact', head: true });

    // We might not have feedbacks table populated yet, but let's try
    let feedbackCount = 0;
    try {
        const { count } = await supabase.from('feedbacks_questions').select('id', { count: 'exact', head: true }).eq('status', 'pending');
        feedbackCount = count || 0;
    } catch (e) {
        // Table might not exist yet if migration failed or wasn't run
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tableau de Bord</h1>
                <p className="text-gray-500 dark:text-gray-400">Vue d'ensemble de l'application et des statistiques.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Utilisateurs Totaux
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +0% depuis le mois dernier
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Questions Actives
                        </CardTitle>
                        <FileQuestion className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questionCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Base de connaissances
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Signalements
                        </CardTitle>
                        <MessageCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feedbackCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            En attente de traitement
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Taux de Réussite
                        </CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Moyenne globale (To Do)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Can add charts here later */}
        </div>
    );
}
