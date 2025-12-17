
import { getQuestions } from '@/lib/actions/questions';
import { getUserProgressList } from '@/lib/actions/user-progress';
import LearningList, { LearningItem } from '@/components/LearningList';

// Next.js 15+ searchParams is a Promise
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ApprendrePage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const limit = 12;
    const search = params?.search as string;
    const chapter = params?.chapter as string;

    // Fetch questions (used as learning content)
    const { questions, total, totalPages } = await getQuestions(
        { theme: chapter, search }, // Note: theme corresponds effectively to chapter in our simplified model
        page,
        limit
    );

    // Fetch user progress
    const learnedModuleIds = await getUserProgressList();

    // Map to LearningItem format
    const items: LearningItem[] = questions.map((q: any) => ({
        id: q.id,
        titre: q.question,
        texte_synthese: `${q.answer}\n\n💡 ${q.explanation || ''}`,
        type_module: q.theme, // or q.info_cards_chapter
        created_at: q.created_at,
        isLearned: learnedModuleIds.includes(q.id)
    }));

    return (
        <div className="p-4 pb-20 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-primary">Apprendre</h1>
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
