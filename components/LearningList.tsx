"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Book, Landmark, ScrollText, Globe, Search, CheckCircle, BookOpen } from "lucide-react";
import { ContenuApprentissage } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { markModuleAsLearned } from "@/lib/actions/user-progress";
import { cn } from "@/lib/utils";

// Extended type for UI
export type LearningItem = ContenuApprentissage & { isLearned?: boolean };

interface LearningListProps {
    items: LearningItem[];
    currentPage: number;
    totalPages: number;
}

const CHAPTERS = [
    { id: 'Histoire', label: 'Histoire', icon: Book, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'Institutions', label: 'Institutions', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'Valeurs', label: 'Valeurs', icon: ScrollText, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'La France dans le monde', label: 'France & Monde', icon: Globe, color: 'text-green-600', bg: 'bg-green-100' }
];

const DIFFICULTIES = [
    { id: 'facile', label: 'Facile', color: 'text-green-700', bg: 'bg-green-100' },
    { id: 'moyen', label: 'Moyen', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    { id: 'difficile', label: 'Difficile', color: 'text-red-700', bg: 'bg-red-100' }
];

export default function LearningList({ items, currentPage, totalPages }: LearningListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentChapter = searchParams.get('chapter');
    const currentDifficulty = searchParams.get('difficulty');
    const searchQuery = searchParams.get('search') || "";

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset page
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleChapterChange = (chapter: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (chapter) {
            params.set('chapter', chapter);
        } else {
            params.delete('chapter');
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleDifficultyChange = (difficulty: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (difficulty) {
            params.set('difficulty', difficulty);
        } else {
            params.delete('difficulty');
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Filters */}
            <div className="space-y-6">
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Rechercher une fiche..."
                        defaultValue={searchQuery}
                        onChange={(e) => {
                            // Debounce could be added here
                            handleSearch(e.target.value);
                        }}
                        className="pl-10 h-12 text-lg shadow-sm border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        variant={!currentChapter ? "default" : "outline"}
                        onClick={() => handleChapterChange(null)}
                        className="rounded-full"
                    >
                        Tout
                    </Button>
                    {CHAPTERS.map(chapter => (
                        <Button
                            key={chapter.id}
                            variant={currentChapter === chapter.id ? "secondary" : "outline"}
                            onClick={() => handleChapterChange(chapter.id)}
                            className={cn(
                                "rounded-full gap-2 transition-all",
                                currentChapter === chapter.id && "bg-gray-900 text-white hover:bg-gray-800"
                            )}
                        >
                            <chapter.icon className={cn("w-4 h-4", currentChapter !== chapter.id && chapter.color)} />
                            {chapter.label}
                        </Button>
                    ))}
                </div>

                {/* Difficulty Filters */}
                <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-400 flex items-center mr-2">Niveau :</span>
                    <Button
                        variant={!currentDifficulty ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleDifficultyChange(null)}
                        className={cn("rounded-full", !currentDifficulty && "bg-gray-100 text-gray-900")}
                    >
                        Tous
                    </Button>
                    {DIFFICULTIES.map(diff => (
                        <Button
                            key={diff.id}
                            variant={currentDifficulty === diff.id ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleDifficultyChange(diff.id)}
                            className={cn(
                                "rounded-full capitalize",
                                currentDifficulty === diff.id && cn(diff.bg, diff.color)
                            )}
                        >
                            {diff.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* filters end */}

            {/* List */}
            {/* List */}
            <div
                key={`${currentChapter}-${currentDifficulty}-${searchQuery}-${currentPage}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {items.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-gray-500">
                        Aucun résultat trouvé.
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                            <LearningCard item={item} />
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', (currentPage - 1).toString());
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                    >
                        Précédent
                    </Button>
                    <span className="flex items-center px-4 font-medium text-gray-600">
                        Page {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', (currentPage + 1).toString());
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
}

function LearningCard({ item }: { item: LearningItem }) {
    const [learned, setLearned] = useState(!!item.isLearned);
    const [isPending, startTransition] = useTransition();

    const toggleLearned = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link
        e.stopPropagation();

        startTransition(async () => {
            // Optimistic update
            setLearned(!learned);
            const result = await markModuleAsLearned(String(item.id));
            if (result.error) {
                setLearned(learned); // Revert
            }
        });
    };

    return (
        <div className={cn(
            "group bg-white p-5 rounded-2xl shadow-sm border transition-all duration-200 relative overflow-hidden flex flex-col",
            learned ? "border-green-200 bg-green-50/30" : "border-gray-100 hover:border-primary/50 hover:shadow-md"
        )}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">
                    {item.titre}
                </h3>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleLearned}
                    className={cn(
                        "h-8 px-2 rounded-full transition-colors",
                        learned ? "text-green-600 bg-green-100 hover:bg-green-200" : "text-gray-300 hover:text-gray-500"
                    )}
                    title={learned ? "Marqué comme appris" : "Marquer comme appris"}
                >
                    <CheckCircle className={cn("w-5 h-5", learned && "fill-current")} />
                </Button>
            </div>

            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">
                {item.texte_synthese}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50/50">
                <div className="flex gap-2">
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {item.type_module}
                    </span>
                    {(item as any).difficulty && (
                        <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded capitalize",
                            (item as any).difficulty === 'facile' ? "bg-green-100 text-green-700" :
                                (item as any).difficulty === 'moyen' ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                        )}>
                            {(item as any).difficulty}
                        </span>
                    )}
                </div>

                <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                    {/* Need a Link component here but difficult inside Button asChild. Just standard Link */}
                    <a href={`/apprendre/${item.id}`} className="flex items-center text-xs">
                        Lire la fiche
                        <BookOpen className="w-3 h-3 ml-1" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
