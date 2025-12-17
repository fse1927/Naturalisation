import { createClient } from '@/lib/supabase/server';
import { ContenuApprentissage } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TextToSpeech from '@/components/TextToSpeech';

// Correctly type params as a Promise for Next.js 15+ async params
type PageParams = Promise<{ id: string }>;

interface PageProps {
    params: PageParams;
}

export default async function LearningDetailPage(props: PageProps) {
    // Await params before using them
    const params = await props.params;
    const { id } = params;

    const supabase = await createClient();

    // 1. Fetch from 'questions' table (unified)
    const { data: questionData } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

    let content: ContenuApprentissage | null = null;

    if (questionData) {
        content = {
            id: questionData.id,
            titre: questionData.question,
            texte_synthese: `${questionData.answer}\n\n💡 ${questionData.explanation || ''}`,
            type_module: questionData.theme, // Map theme to module type
            created_at: questionData.created_at
        };
    }

    if (!content) {
        notFound();
    }

    const item = content;

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <Link href="/apprendre" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour aux fiches
            </Link>

            <article className="space-y-6">
                <header className="space-y-4">
                    <div className="flex gap-2">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase tracking-wider">
                            {item.type_module}
                        </span>
                        {(questionData as any).difficulty && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                                ${(questionData as any).difficulty === 'facile' ? 'bg-green-100 text-green-700' :
                                    (questionData as any).difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}`}>
                                {(questionData as any).difficulty}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{item.titre}</h1>

                    <TextToSpeech text={item.texte_synthese} />
                </header>

                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    {item.texte_synthese}
                </div>
            </article>
        </div>
    );
}
