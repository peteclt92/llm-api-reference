"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

export function Header() {
    const { scrollY } = useScroll();

    // Animation Configurations
    const range = [0, 50];

    // Border: Transparent to visible theme color (very subtle)
    const borderOpacity = useTransform(scrollY, range, [0, 0.3]);
    const borderColor = useMotionTemplate`rgba(var(--header-border), ${borderOpacity})`;

    return (
        <div className="sticky top-0 z-50 flex justify-center w-full pointer-events-none">
            <motion.header
                style={{
                    borderColor,
                    borderBottomWidth: "1px",
                    borderStyle: "solid",
                }}
                className="pointer-events-auto w-full bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl border-transparent transition-colors duration-300"
            >
                {/* Content Container - Centered and constrained */}
                <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100">
                        <Terminal className="w-6 h-6" />
                        <span className="hidden sm:inline">LLM Reference</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/llms.txt"
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            llms.txt
                        </Link>
                        <a
                            href="https://github.com/peteclt92/llm-api-reference"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            GitHub
                        </a>
                        <ThemeToggle />
                    </nav>
                </div>
            </motion.header>
        </div>
    );
}
