import { Model } from "@/lib/types";
import { Copy, Check, Calendar, Box } from "lucide-react";
import { useState } from "react";
import { ModelSnippets } from "./ModelSnippets";
import { useRouter, useSearchParams } from "next/navigation";

interface ModelCardProps {
    model: Model;
    selectedCapabilities: string[];
}

export function ModelCard({ model, selectedCapabilities }: ModelCardProps) {
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleCapability = (capability: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentCaps = params.get("capability") ? params.get("capability")!.split(",") : [];

        let newCaps;
        if (currentCaps.includes(capability)) {
            newCaps = currentCaps.filter(c => c !== capability);
        } else {
            newCaps = [...currentCaps, capability];
        }

        if (newCaps.length > 0) {
            params.set("capability", newCaps.join(","));
        } else {
            params.delete("capability");
        }

        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {model.provider}
                        </span>
                        {model.status === "beta" && (
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                BETA
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {model.model_name}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        Context
                    </div>
                    <div className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {(model.context_window / 1000).toLocaleString()}k
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 rounded-md p-2 border border-zinc-100 dark:border-zinc-800 group">
                    <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 truncate mr-2">
                        {model.api_string}
                    </code>
                    <button
                        onClick={() => copyToClipboard(model.api_string)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        title="Copy API String"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        Input / 1M
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        ${model.pricing.input_per_1m.toFixed(2)}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        Output / 1M
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        ${model.pricing.output_per_1m.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {model.capabilities.map((cap) => (
                    <button
                        key={cap}
                        onClick={() => toggleCapability(cap)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${selectedCapabilities.includes(cap)
                                ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {cap}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Verified {model.last_verified}</span>
                </div>
            </div>

            <details className="group mt-4">
                <summary className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer select-none">
                    <Box size={16} />
                    <span>View Code Snippets</span>
                </summary>
                <div className="mt-2">
                    <ModelSnippets model={model} />
                </div>
            </details>
        </div>
    );
}
