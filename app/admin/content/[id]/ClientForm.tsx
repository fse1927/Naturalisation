'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentEditor } from '@/components/admin/content/ContentEditor';
import { upsertContent } from '@/app/admin/content/actions';

export function ClientForm({ content, isNew }: { content: any; isNew: boolean }) {
    const [editorValue, setEditorValue] = useState(content?.texte_synthese || '');
    const [isPending, setIsPending] = useState(false);

    return (
        <form
            action={async (formData) => {
                setIsPending(true);
                // Manually append editor value
                formData.set('texte_synthese', editorValue);
                if (isNew) formData.set('id', 'new');
                else formData.set('id', content.id);

                try {
                    await upsertContent(formData);
                } catch (e) {
                    alert('Erreur lors de la sauvegarde');
                    setIsPending(false);
                }
            }}
            className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Titre du module</label>
                    <Input
                        name="titre"
                        defaultValue={content?.titre || ''}
                        required
                        placeholder="Ex: La Révolution Française"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type (Thème)</label>
                    <select
                        name="type_module"
                        defaultValue={content?.type_module || 'Histoire'}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="Histoire">Histoire</option>
                        <option value="Institutions">Institutions</option>
                        <option value="Valeurs">Valeurs</option>
                        <option value="Géographie">Géographie</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">URL Audio (Optionnel)</label>
                <Input
                    name="audio_url"
                    defaultValue={content?.audio_url || ''}
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Contenu (Synthèse)</label>
                <ContentEditor
                    initialValue={editorValue}
                    onChange={setEditorValue}
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Sauvegarde...' : 'Enregistrer le module'}
                </Button>
            </div>
        </form>
    );
}
