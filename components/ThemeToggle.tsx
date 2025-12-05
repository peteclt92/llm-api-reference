"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    // Prevent rendering until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <button
                className="relative w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors duration-200 focus:outline-none"
                aria-label="Toggle theme"
            >
                <div className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 shadow-sm" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 shadow-sm transition-transform duration-200 flex items-center justify-center ${resolvedTheme === "dark" ? "translate-x-7" : "translate-x-0"
                    }`}
            >
                {resolvedTheme === "dark" ? (
                    <Moon size={14} className="text-zinc-400" />
                ) : (
                    <Sun size={14} className="text-zinc-600" />
                )}
            </div>
        </button>
    );
}
