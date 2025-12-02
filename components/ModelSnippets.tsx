"use client";

import { useState } from "react";
import { Model } from "@/lib/types";
import { generateSnippets } from "@/lib/snippets";
import { CodeBlock } from "./CodeBlock";

interface ModelSnippetsProps {
    model: Model;
}

export function ModelSnippets({ model }: ModelSnippetsProps) {
    const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">("curl");
    const snippets = generateSnippets(model);

    return (
        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <div className="flex gap-4 mb-3 border-b border-zinc-100 dark:border-zinc-800">
                {(["curl", "python", "javascript"] as const).map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === lang
                                ? "text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                            }`}
                    >
                        {lang === "javascript" ? "JavaScript" : lang === "curl" ? "cURL" : "Python"}
                        {activeTab === lang && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
                        )}
                    </button>
                ))}
            </div>
            <CodeBlock code={snippets[activeTab]} language={activeTab} />
        </div>
    );
}
