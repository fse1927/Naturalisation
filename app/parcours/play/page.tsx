import { getParcoursQuestions } from '@/lib/actions/user-progress';
import ParcoursRunner from '@/components/ParcoursRunner';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ParcoursPlayPage(
    props: {
        searchParams: SearchParams
    }
) {
    const searchParams = await props.searchParams;
    const level = typeof searchParams.level === 'string' ? searchParams.level : 'facile';

    // Fetch 10 unlearned questions for this level
    const questions = await getParcoursQuestions(level, 10);

    if (questions.length === 0) {
        return (
            <div className="container max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
                <div className="bg-green-50 p-8 rounded-3xl border border-green-100 inline-block mb-4">
                    <Trophy className="w-16 h-16 text-green-600 mx-auto" />
                </div>
                <h1 className="text-3xl font-black text-gray-900">Niveau Complété !</h1>
                <p className="text-lg text-gray-600">
                    Félicitations ! Vous avez maîtrisé toutes les questions du niveau <span className="capitalize font-bold text-green-600">{level}</span>.
                </p>
                <div className="pt-8">
                    <Link href="/parcours">
                        <Button size="lg" className="font-bold px-8">
                            Retour au Parcours
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 min-h-screen">
            <ParcoursRunner initialQuestions={questions} level={level} />
        </div>
    );
}
