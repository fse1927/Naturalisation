import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MessageCircle, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityItem {
    id: string;
    type: 'user' | 'feedback';
    title: string;
    description: string;
    date: string;
    meta?: string; // e.g., role or status
}

interface RecentActivityFeedProps {
    items: RecentActivityItem[];
}

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Activité Récente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {items.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${item.type === 'user'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                    }`}>
                                    {item.type === 'user' ? <User className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                        {item.title}
                                        {item.meta && item.meta === 'admin' && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                <Shield className="w-3 h-3 mr-1" /> Admin
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(item.date).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short'
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link href="/admin/users" className="text-sm text-primary hover:text-blue-600 font-medium flex items-center justify-center">
                        Voir tout l'historique
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
