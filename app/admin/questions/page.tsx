import { createClient } from '@/lib/supabase/server';
import { QuestionTable } from '@/components/admin/questions/QuestionTable';
import { Question } from '@/lib/data/types';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function QuestionsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.query === 'string' ? searchParams.query : '';
    const theme = typeof searchParams.theme === 'string' ? searchParams.theme : '';
    const editId = typeof searchParams.edit === 'string' ? searchParams.edit : null;
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const supabase = await createClient();

    let dbQuery = supabase
        .from('questions')
        .select('*', { count: 'exact' });

    if (query) {
        dbQuery = dbQuery.ilike('question', `%${query}%`);
    }

    if (theme) {
        dbQuery = dbQuery.eq('theme', theme);
    }

    const { data, count, error } = await dbQuery
        .range(offset, offset + pageSize - 1)
        .order('created_at', { ascending: false });

    // If editId provided, fetch that question if not in list
    let editingQuestion: Question | null = null;
    if (editId) {
        const found = (data as Question[])?.find(q => q.id.toString() === editId);
        if (found) {
            editingQuestion = found;
        } else {
            const { data: qData } = await supabase
                .from('questions')
                .select('*')
                .eq('id', editId)
                .single();
            if (qData) editingQuestion = qData as Question;
        }
    }

    if (error) {
        console.error('Error fetching questions:', error);
        return <div>Error loading questions</div>;
    }

    const questions = (data as Question[]) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Questions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gérez la banque de questions (Quiz & Entretien).</p>
                </div>
                {/* Export / Import buttons could go here */}
            </div>

            <QuestionTable
                questions={questions}
                totalCount={count || 0}
                currentPage={page}
                pageSize={pageSize}
                editingQuestion={editingQuestion}
            />
        </div>
    );
}
