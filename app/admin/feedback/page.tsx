import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { updateFeedbackStatus } from './actions';

export default async function FeedbackPage() {
    const supabase = await createClient();

    // Fetch feedbacks with related question and user
    // Note: Join syntax depends on foreign keys.
    const { data, error } = await supabase
        .from('feedbacks_questions')
        .select(`
            id,
            message,
            status,
            created_at,
            question:questions(id, question),
            user:utilisateurs(nom_prenom, email)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feedback:', error);
        return <div>Erreur de chargement.</div>;
    }

    const feedbacks = data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Signalements</h1>
                <p className="text-gray-500 dark:text-gray-400">Gérez les retours utilisateurs sur les questions.</p>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800">
                        <tr>
                            <th className="px-4 py-3 font-medium">Utilisateur</th>
                            <th className="px-4 py-3 font-medium">Question</th>
                            <th className="px-4 py-3 font-medium">Message</th>
                            <th className="px-4 py-3 font-medium">Statut</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {feedbacks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Aucun signalement.
                                </td>
                            </tr>
                        ) : feedbacks.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {item.user?.nom_prenom || 'Inconnu'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.user?.email}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-xs truncate" title={item.question?.question}>
                                    <Link
                                        href={`/admin/questions?edit=${item.question?.id}`}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {item.question?.question || 'Question supprimée'}
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    {item.message || '-'}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                        ${item.status === 'pending' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200' :
                                            item.status === 'resolved' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        {item.status === 'pending' ? 'En attente' :
                                            item.status === 'resolved' ? 'Résolu' : 'Ignoré'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {item.status === 'pending' && (
                                        <form className="flex justify-end gap-2">
                                            {/* We use hidden inputs or bind params. For simplicity using client component wrapper or just form action with bind would be cleaner but here inline: */}
                                            <Button
                                                formAction={async () => {
                                                    'use server';
                                                    await updateFeedbackStatus(item.id, 'resolved');
                                                }}
                                                variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" title="Marquer comme résolu"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                formAction={async () => {
                                                    'use server';
                                                    await updateFeedbackStatus(item.id, 'ignored');
                                                }}
                                                variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" title="Ignorer"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
