
import InterviewSimulator from '@/components/InterviewSimulator';
import { MessageCircle } from 'lucide-react';
import { getUserProfile } from '@/app/profil/actions';
import { getInterviewQuestions } from '@/lib/actions/questions';
import { InterviewQuestion } from '@/components/interview/useInterview';

export const dynamic = 'force-dynamic';

export default async function EntretienPage() {
    const data = await getUserProfile();
    const userSituation = data?.user.profil_situation || 'salarié'; // Default if null

    // Fetch sorted questions based on profile
    const rawQuestions = await getInterviewQuestions(userSituation);

    // Map to InterviewQuestion type if needed, or cast if they match structure
    // Since migration unified schema, `questions` table has `metadata`.
    // getInterviewQuestions defined in lib/actions/questions.ts returns objects.
    const questions: InterviewQuestion[] = rawQuestions.map((q: any) => ({
        id: q.id,
        question: q.question,
        category: q.theme,
        metadata: {
            answer_tips: q.metadata?.answer_tips,
            required_for: q.metadata?.required_for
        },
        // Fallback or mapped
        answer_tips: q.metadata?.answer_tips || ""
    }));

    return (
        <div className="p-4 pb-24 max-w-xl mx-auto space-y-6">
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-primary">Entretien ({userSituation})</h1>
                <p className="text-gray-600">
                    Simulez les questions posées par l&apos;agent de préfecture.
                </p>
            </header>

            <InterviewSimulator userSituation={userSituation} questions={questions} />
        </div>
    );
}
