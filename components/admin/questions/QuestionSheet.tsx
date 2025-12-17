'use client';

import { Question } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface QuestionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    question: Question | null;
}

export function QuestionSheet({ isOpen, onClose, question }: QuestionSheetProps) {
    const [isPending, setIsPending] = useState(false);

    // Form States
    const [type, setType] = useState(question ? (question as any)?.type || 'quiz' : 'quiz');
    // const [options, setOptions] = useState(['', '', '']); // This state is not directly used for default values, but for dynamic input management if needed.

    // Reset form when question changes
    const defaultValues = {
        question: question?.question || '',
        answer: question?.answer || '',
        theme: question?.theme || 'Histoire',
        type: question?.type || 'quiz',
        options: question?.options || ['', '', ''],
        tips: (question?.metadata as any)?.tips || '', // Metadata is generic, might need cast or better type
        difficulty: question?.difficulty || 'moyen'
    };

    // Need to update state when prop changes
    // Better to use a key on the component to force re-render or useEffect
    // For now, I'll trust the parent uses <QuestionSheet key={selectedQuestion?.id} ... /> or similar trick
    // BUT the parent is Client Component and Sheet is always rendered.
    // So I need a useEffect to sync state.

    /* However, handling complex form state in vanilla React inside a modal is verbose. 
       I will use simple defaultValue with key={question?.id} to reset form.
       But I need state for dynamic 'Type' toggle (hide/show options).
    */

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[600px] z-50 bg-white dark:bg-slate-950 shadow-2xl p-6 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {question ? 'Modifier la question' : 'Nouvelle question'}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form
                            action={async (formData) => {
                                setIsPending(true);
                                try {
                                    // Dynamic imports inside client component if needed, or import at top
                                    const { upsertQuestion } = await import('@/app/admin/questions/actions');
                                    await upsertQuestion(formData);
                                    onClose();
                                } catch (e) {
                                    alert('Erreur lors de la sauvegarde');
                                } finally {
                                    setIsPending(false);
                                }
                            }}
                            className="space-y-6"
                            key={question?.id || 'new'}
                        >
                            <input type="hidden" name="id" value={question?.id || ''} />

                            {/* Type & Theme Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <select
                                        name="type"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        defaultValue={defaultValues.type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="quiz">Quiz (QCM)</option>
                                        <option value="interview">Entretien</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Thème</label>
                                    <select
                                        name="theme"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        defaultValue={defaultValues.theme}
                                    >
                                        <option value="Histoire">Histoire</option>
                                        <option value="Institutions">Institutions</option>
                                        <option value="Valeurs">Valeurs</option>
                                        <option value="Géographie">Géographie</option>
                                        <option value="Symboles">Symboles</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Difficulté</label>
                                    <select
                                        name="difficulty"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                        defaultValue={defaultValues.difficulty}
                                    >
                                        <option value="facile">Facile</option>
                                        <option value="moyen">Moyen</option>
                                        <option value="difficile">Difficile</option>
                                    </select>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Question</label>
                                <textarea
                                    name="question"
                                    required
                                    defaultValue={defaultValues.question}
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                    placeholder="Intitulé de la question..."
                                />
                            </div>

                            {/* Answer */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {type === 'quiz' ? 'Bonne Réponse' : 'Réponse type / Mots clés'}
                                </label>
                                <textarea
                                    name="reponse_correcte"
                                    required
                                    defaultValue={defaultValues.answer}
                                    className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                    placeholder="La bonne réponse..."
                                />
                            </div>

                            {/* Options (Quiz only) */}
                            {type === 'quiz' && (
                                <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-100 dark:border-slate-800">
                                    <label className="text-sm font-semibold block mb-2">Mauvaises Réponses</label>
                                    {[1, 2, 3].map((i) => (
                                        <input
                                            key={i}
                                            name={`option_${i}`}
                                            defaultValue={defaultValues.options[i - 1] || ''}
                                            className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm"
                                            placeholder={`Option ${i}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Conseils / Astuces</label>
                                <textarea
                                    name="tips"
                                    defaultValue={defaultValues.tips}
                                    className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                    placeholder="Conseils pour l'apprenant..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Sauvegarde...' : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
