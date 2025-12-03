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
        <div className="relative group">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                    title="Copy Code"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
            <pre className="bg-zinc-900 text-zinc-100 p-4 pt-10 rounded-lg overflow-x-auto text-sm font-mono">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}
