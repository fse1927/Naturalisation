'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Shield,
    ShieldOff,
    Trash2,
    Search,
    User,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { toggleAdminStatus, deleteUser } from '@/app/admin/users/actions';
import { UserProfile } from '@/lib/types';

// Fallback Input if not existing
function SearchInput({ ...props }: any) {
    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
                className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
}

interface UserTableProps {
    users: any[];
    currentPage: number;
    totalPages: number;
    searchQuery: string;
}

export function UserTable({ users, currentPage, totalPages, searchQuery }: UserTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/users?q=${searchTerm}&page=1`);
    };

    const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'revoke' : 'grant'} admin rights?`)) return;

        startTransition(async () => {
            try {
                await toggleAdminStatus(userId, !currentStatus);
            } catch (e) {
                alert('Failed to update status');
            }
        });
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;

        startTransition(async () => {
            try {
                await deleteUser(userId);
            } catch (e) {
                alert('Failed to delete user');
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm">
                    <SearchInput
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="outline">Rechercher</Button>
                </form>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-4 py-3">Utilisateur</TableHead>
                            <TableHead className="px-4 py-3">Email</TableHead>
                            <TableHead className="px-4 py-3">Situation</TableHead>
                            <TableHead className="px-4 py-3">Rôle</TableHead>
                            <TableHead className="px-4 py-3">Date d'inscription</TableHead>
                            <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    Aucun utilisateur trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50/50">
                                    <TableCell className="px-4 py-3 font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            {user.nom_prenom || 'Sans nom'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500">{user.email || '-'}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {user.profil_situation || 'Non défini'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 gap-1">
                                                <Shield className="w-3 h-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Utilisateur
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                                className={user.is_admin ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                                                title={user.is_admin ? "Révoquer Admin" : "Promouvoir Admin"}
                                            >
                                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />)}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Page {currentPage} sur {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/users?q=${searchQuery}&page=${currentPage - 1}`)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/users?q=${searchQuery}&page=${currentPage + 1}`)}
                        disabled={currentPage >= totalPages}
                    >
                        Suivant <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
