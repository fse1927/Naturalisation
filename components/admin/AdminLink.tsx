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
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-bold animate-in fade-in zoom-in"
        >
            <Shield className="w-4 h-4" />
            Mode Admin
        </Link>
    );
}
