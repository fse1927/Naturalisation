import { Loader2 } from 'lucide-react';

interface QuizLoadingProps {
    mode: 'training' | 'exam';
}

export function QuizLoading({ mode }: QuizLoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="mt-4 font-medium">
                Préparation du {mode === 'exam' ? 'grand examen' : 'quiz'}...
            </p>
        </div>
    );
}
