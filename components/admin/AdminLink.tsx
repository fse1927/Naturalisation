'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

interface AdminLinkProps {
    isAdmin: boolean;
}

export function AdminLink({ isAdmin }: AdminLinkProps) {
    if (!isAdmin) return null;

    return (
        <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold text-sm"
        >
            <Shield className="w-4 h-4" />
            Administration
        </Link>
    );
}
