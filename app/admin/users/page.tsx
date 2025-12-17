import { getUsers } from './actions';
import { UserTable } from '@/components/admin/users/UserTable';
import { Users } from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersAdminPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const query = typeof params.q === 'string' ? params.q : '';

    const { users, totalPages } = await getUsers(query, page);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    Gestion des Utilisateurs
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Consultez, recherchez et gérez les comptes utilisateurs et leurs permissions.
                </p>
            </div>

            <UserTable
                users={users}
                currentPage={page}
                totalPages={totalPages}
                searchQuery={query}
            />
        </div>
    );
}
