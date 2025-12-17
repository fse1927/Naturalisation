import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, FileQuestion, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getDashboardStats } from './dashboard-actions';
import { GlobalActivityChart } from '@/components/admin/dashboard/GlobalActivityChart';
import { RecentActivityFeed } from '@/components/admin/dashboard/RecentActivityFeed';

export default async function AdminDashboardPage() {
    // Fetch all stats via dedicated server action
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Tour de Contrôle
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Aperçu global de l'activité.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Utilisateurs"
                    value={stats.userCount}
                    icon={Users}
                    color="text-blue-500"
                    trend="+12% this week" // Mock data for now
                    trendUp={true}
                />
                <KpiCard
                    title="Questions Actives"
                    value={stats.questionCount}
                    icon={FileQuestion}
                    color="text-green-500"
                    description="Base de connaissances"
                />
                <KpiCard
                    title="Signalements"
                    value={stats.feedbackCount}
                    icon={MessageCircle}
                    color="text-orange-500"
                    alert={stats.feedbackCount > 0}
                    description="En attente de traitement"
                />
                <KpiCard
                    title="Tests Réalisés"
                    value={stats.activityData.reduce((acc, curr) => acc + curr.tests, 0)} // Sum of last 30 days
                    icon={Activity}
                    color="text-purple-500"
                    trend="30 derniers jours"
                />
            </div>

            {/* Main Content Grid: Chart + Feed */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Chart takes 4/7 width */}
                <div className="md:col-span-4">
                    <GlobalActivityChart data={stats.activityData} />
                </div>

                {/* Feed takes 3/7 width */}
                <div className="md:col-span-3">
                    <RecentActivityFeed items={stats.recentActivity} />
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, color, trend, trendUp, alert, description }: any) {
    return (
        <Card className={`hover:shadow-lg transition-all hover:-translate-y-1 duration-300 ${alert ? 'border-orange-200 bg-orange-50/10 dark:border-orange-900/50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-full ${alert ? 'bg-orange-100 dark:bg-orange-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold tracking-tight">{value}</div>

                {(trend || description) && (
                    <div className="flex items-center gap-2 mt-2">
                        {trend && (
                            <span className={`text-xs font-medium flex items-center ${trendUp ? 'text-green-600' : 'text-gray-500'}`}>
                                {trendUp && <TrendingUp className="w-3 h-3 mr-1" />}
                                {trend}
                            </span>
                        )}
                        {description && (
                            <span className="text-xs text-muted-foreground truncate">
                                {description}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
