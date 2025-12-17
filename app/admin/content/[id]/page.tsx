import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { ContentEditor } from '@/components/admin/content/ContentEditor';
import { notFound, redirect } from 'next/navigation';
import { upsertContent } from '@/app/admin/content/actions';
import { ClientForm } from './ClientForm'; // We need a client component for the form mainly for Editor state

// Helper page component
type PageParams = Promise<{ id: string }>;

export default async function ContentEditPage(props: { params: PageParams }) {
    const params = await props.params;
    const { id } = params;
    const isNew = id === 'new';

    let content = null;

    if (!isNew) {
        const supabase = await createClient();
        const { data } = await supabase
            .from('contenu_apprentissage')
            .select('*')
            .eq('id', id)
            .single();

        if (!data) notFound();
        content = data;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/content">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">
                    {isNew ? 'Nouveau Module' : 'Modifier le Module'}
                </h1>
            </div>

            <ClientForm content={content} isNew={isNew} />
        </div>
    );
}
