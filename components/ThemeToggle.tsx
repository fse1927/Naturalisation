"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Init from local storage or system pref
        const stored = localStorage.getItem("theme");
        if (stored === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else if (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            // Optional: Auto detect system
            // setIsDark(true);
            // document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
        >
            {isDark ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
            <span className="sr-only">Changer le thème</span>
        </Button>
    );
}
