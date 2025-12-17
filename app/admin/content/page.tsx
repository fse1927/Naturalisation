import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ContenuApprentissage } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function ContentPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch content from 'questions' table
    const { data: questions, error, count } = await supabase
        .from('questions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching content:', error);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    const items = (questions || []).map((q: any) => ({
        id: q.id,
        titre: q.question,
        texte_synthese: `${q.answer}\n\n${q.explanation || ''}`,
        type_module: q.theme || 'Général',
        created_at: q.created_at,
    })) as ContenuApprentissage[];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
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
                    <div key={item.id} className="group relative bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition-all overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
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
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2" title={item.titre}>
                                {item.titre}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                {item.texte_synthese}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-950/50 px-6 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 text-xs text-gray-400 mt-auto">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 dark:border-slate-800">
                    <div className="text-sm text-gray-500">
                        Page {page} sur {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/content?page=${page - 1}`} className={page <= 1 ? "pointer-events-none" : ""}>
                            <Button variant="outline" size="sm" disabled={page <= 1}>
                                <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
                            </Button>
                        </Link>
                        <Link href={`/admin/content?page=${page + 1}`} className={page >= totalPages ? "pointer-events-none" : ""}>
                            <Button variant="outline" size="sm" disabled={page >= totalPages}>
                                Suivant <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
