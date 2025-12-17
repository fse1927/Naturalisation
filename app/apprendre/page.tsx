
import { getQuestions } from '@/lib/actions/questions';
import { getUserProgressList } from '@/lib/actions/user-progress';
import LearningList, { LearningItem } from '@/components/LearningList';
import { Question } from '@/lib/data/types';

// Next.js 15+ searchParams is a Promise
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
    title: 'Apprendre | Fiches & Quiz',
    description: 'Parcourez les fiches de révision (Histoire, Valeurs, Géographie) et testez vos connaissances.',
};

export default async function ApprendrePage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const limit = 10;
    const search = params?.search as string;
    const chapter = params?.chapter as string;
    const difficulty = params?.difficulty as string;

    // Fetch questions (used as learning content)
    const { questions, total, totalPages } = await getQuestions(
        { theme: chapter, search, difficulty }, // Note: theme corresponds effectively to chapter in our simplified model
        page,
        limit
    );

    // Fetch user progress
    const learnedModuleIds = await getUserProgressList();

    // Map to LearningItem format
    const items: LearningItem[] = questions.map((q: Question) => ({
        id: q.id,
        titre: q.question,
        texte_synthese: `${q.answer}\n\n💡 ${q.explanation || ''}`,
        type_module: q.theme, // or q.info_cards_chapter
        created_at: q.created_at || new Date().toISOString(),
        isLearned: learnedModuleIds.includes(q.id),
        difficulty: q.difficulty // Add difficulty to item
    }));

    return (
        <div className="p-4 pb-20 space-y-6">
            <header>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-primary">Apprendre</h1>
                    {difficulty && (
                        <span className="bg-gradient-to-r from-gray-800 to-black text-white px-3 py-1 rounded-full text-sm font-bold capitalize animate-in slide-in-from-left-5">
                            Niveau {difficulty}
                        </span>
                    )}
                </div>
                <p className="text-gray-600">Fiches de révision essentielles et Livret du Citoyen.</p>
            </header>

            <LearningList
                items={items}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
}
