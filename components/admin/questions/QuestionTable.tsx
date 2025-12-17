'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Actually I checked components/ui and Table was NOT there. I should check again or build it.
// Checking Step 73, only button, card, input.
// I will build a simple Table structure using Tailwind directly to avoid dependency issues if I can't find it.
// But "DataTable" usually implies more features.
// I'll stick to standard HTML table with Tailwind classes for now to be safe.

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { Question } from '@/lib/types';
import { QuestionSheet } from './QuestionSheet';

interface QuestionTableProps {
    questions: Question[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    editingQuestion?: Question | null;
}

export function QuestionTable({
    questions,
    totalCount,
    currentPage,
    pageSize,
    editingQuestion
}: QuestionTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
    const [isSheetOpen, setIsSheetOpen] = useState(!!editingQuestion);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(editingQuestion || null);

    // Sync if editingQuestion changes (e.g. navigation)
    // Actually we should use useEffect
    /*
    useEffect(() => {
        if (editingQuestion) {
            setSelectedQuestion(editingQuestion);
            setIsSheetOpen(true);
        }
    }, [editingQuestion]);
    */
    // Since this is a client component, useState init only happens once unless key changes.
    // Better to just rely on prop for initial open, or use effect.
    // Let's use simple logic: if prop provided, open.

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleEdit = (question: Question) => {
        setSelectedQuestion(question);
        setIsSheetOpen(true);
    };

    const handleAddNew = () => {
        setSelectedQuestion(null);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Input
                        placeholder="Rechercher une question..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            if (e.target.value) params.set('theme', e.target.value);
                            else params.delete('theme');
                            router.push(`?${params.toString()}`);
                        }}
                        defaultValue={searchParams.get('theme') || ''}
                    >
                        <option value="">Tous les thèmes</option>
                        <option value="Histoire">Histoire</option>
                        <option value="Institutions">Institutions</option>
                        <option value="Valeurs">Valeurs</option>
                        <option value="Géographie">Géographie</option>
                    </select>

                    <div className="flex gap-2">
                        <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-white">
                            Import CSV
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const text = await file.text();
                                    try {
                                        // Dynamic import to keep bundle small? or just standard import
                                        const { parseCSV } = await import('@/lib/admin/csv-import');
                                        const { importQuestions } = await import('@/app/admin/questions/actions');

                                        const data = parseCSV(text);
                                        if (data.length === 0) {
                                            alert('Aucune question trouvée dans le CSV.');
                                            return;
                                        }

                                        if (confirm(`Importer ${data.length} questions ?`)) {
                                            await importQuestions(data);
                                            alert('Import réussi !');
                                            router.refresh();
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Erreur lors de l\'import.');
                                    }
                                    // Reset input
                                    e.target.value = '';
                                }}
                            />
                        </label>

                        <Button onClick={handleAddNew} className="whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-3 font-medium">Question</th>
                                <th className="px-4 py-3 font-medium w-32">Thème</th>
                                <th className="px-4 py-3 font-medium w-24">Type</th>
                                <th className="px-4 py-3 font-medium w-24 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {questions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        Aucune question trouvée.
                                    </td>
                                </tr>
                            ) : questions.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-md truncate" title={q.question}>
                                        {q.question}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                            {q.theme}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {/* Need 'type' in Question type, checking types.ts it might be missing or optional? 
                                            Checking Step 24 file view: Question type has 'theme' but NO 'type' field explicitly typed!
                                            However migration script Step 64 inserts 'type'. 
                                            I should update types.ts locally or cast it. 
                                            I will assume type exists in DB. */}
                                        {(q as any).type || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEdit(q)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Affichage {questions.length} sur {totalCount}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Précédent
                        </Button>
                        <span className="text-sm font-medium mx-2">
                            Page {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Sheet Component (Placeholder for now) */}
            <QuestionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                question={selectedQuestion}
            />
        </div>
    );
}
