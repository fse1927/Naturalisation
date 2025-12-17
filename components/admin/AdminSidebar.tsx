'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileQuestion,
    BookOpen,
    Flag,
    Menu,
    LogOut,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { label: 'Tableau de Bord', icon: LayoutDashboard, href: '/admin' },
    { label: 'Questions', icon: FileQuestion, href: '/admin/questions' },
    { label: 'Contenu', icon: BookOpen, href: '/admin/content' },
    { label: 'Signalements', icon: Flag, href: '/admin/feedback' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-200 dark:border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Space
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                            )} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-800">
                        <span className="font-bold">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-900 dark:text-white">Administrateur</p>
                        <p className="truncate text-xs">admin@rfc.fr</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="bg-white/80 backdrop-blur-md shadow-sm dark:bg-slate-950/80"
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 h-full z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer (Custom using Framer Motion) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-3/4 max-w-xs z-50 lg:hidden bg-white dark:bg-slate-950 shadow-2xl"
                        >
                            <div className="absolute top-4 right-4 z-50">
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
