"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, MessageCircle, User, Trophy } from "lucide-react";
import clsx from "clsx";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Apprendre",
            href: "/apprendre",
            icon: BookOpen,
        },
        {
            label: "Tester",
            href: "/tester",
            icon: FileText,
        },
        {
            label: "Entretien",
            href: "/entretien",
            icon: MessageCircle,
        },
        {
            label: "Parcours",
            href: "/parcours",
            icon: Trophy,
        },
        {
            label: "Profil",
            href: "/profil",
            icon: User,
        },
    ];

    // Hide BottomNav on Auth pages and Admin pages
    if (pathname.includes("/login") || pathname.includes("/signup") || pathname === "/" || pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 pb-safe z-50 shadow-lg shadow-gray-200/50 transition-all duration-300">
            <div className="flex justify-around items-center h-20 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 group",
                                isActive ? "text-primary translate-y-[-2px]" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {/* Active Indicator Background */}
                            {isActive && (
                                <div className="absolute top-2 w-12 h-12 bg-primary/10 rounded-2xl -z-10 transition-all duration-300 animate-in fade-in zoom-in" />
                            )}

                            <Icon
                                className={clsx(
                                    "w-6 h-6 mb-1.5 transition-transform duration-300",
                                    isActive ? "stroke-[2.5px] scale-110" : "group-hover:scale-105"
                                )}
                            />
                            <span className={clsx(
                                "text-[10px] font-bold tracking-wide transition-all",
                                isActive ? "text-primary" : "text-gray-400"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
