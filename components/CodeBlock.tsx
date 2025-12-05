"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <div className="absolute right-2 top-2">
                <button
                    onClick={copyToClipboard}
                    className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shadow-sm"
                    title="Copy Code"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
            <pre className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 pt-10 rounded-lg overflow-x-auto text-sm font-mono">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}
