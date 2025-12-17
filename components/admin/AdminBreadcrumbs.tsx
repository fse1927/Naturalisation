'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

const routeNameMap: Record<string, string> = {
    'admin': 'Tableau de bord',
    'users': 'Utilisateurs',
    'questions': 'Questions',
    'content': 'Contenu',
    'feedback': 'Signalements',
    'create': 'Créer',
    'edit': 'Éditer'
};

export function AdminBreadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    // Don't show on root admin (redundant with title)
    if (paths.length <= 1) return null;

    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6 animate-in fade-in slide-in-from-left-2">
            <Link
                href="/admin"
                className="hover:text-primary transition-colors flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md"
            >
                <Home className="w-4 h-4" />
            </Link>

            {paths.map((path, index) => {
                if (path === 'admin') return null; // Skip root

                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;
                const name = routeNameMap[path] || path; // Fallback to path name, maybe capitalize?

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                        {isLast ? (
                            <span className="font-semibold text-gray-900 dark:text-gray-200 px-1">
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-primary transition-colors hover:bg-gray-100 px-2 py-1 rounded-md"
                            >
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
