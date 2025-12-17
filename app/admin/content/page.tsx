import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ContenuApprentissage } from '@/lib/types';

export default async function ContentPage() {
    const supabase = await createClient();

    // Fetch content
    // Note: table 'contenu_apprentissage' created in migration.
    const { data, error } = await supabase
        .from('contenu_apprentissage')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching content:', error);
        // Error handling UI
    }

    const items = (data as ContenuApprentissage[]) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Contenu d'Apprentissage</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gérez les fiches et modules du Livret du Citoyen.</p>
                </div>
                <Link href="/admin/content/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Module
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div key={item.id} className="group relative bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition-all overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                                    {item.type_module}
                                </span>
                                <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                    <Link href={`/admin/content/${item.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    {/* Delete Button would need a client component or server action form */}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {item.titre}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                {item.texte_synthese}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-950/50 px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 text-xs text-gray-400">
                            <BookOpen className="w-3 h-3" />
                            Livret du Citoyen
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                        <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p>Aucun contenu pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
