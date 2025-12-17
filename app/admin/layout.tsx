import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AdminSidebar />
            <main className="lg:pl-64 min-h-screen transition-all">
                <div className="container mx-auto p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl">
                    <AdminBreadcrumbs />
                    {children}
                </div>
            </main>
        </div>
    );
}
