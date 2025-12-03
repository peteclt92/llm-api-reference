"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";

export function Header() {
    const [showBorder, setShowBorder] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBorder(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-[350ms] ${showBorder ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    <Terminal className="w-6 h-6" />
                    <span>LLM Reference</span>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link
                        href="/llms.txt"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                        llms.txt
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                        GitHub
                    </a>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
