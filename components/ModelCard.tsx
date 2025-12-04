import { Model } from "@/lib/types";
import { Copy, Check, Calendar, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { ModelSnippets } from "./ModelSnippets";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./ThemeProvider";

interface ModelCardProps {
    model: Model;
    selectedCapabilities: string[];
    isSelected?: boolean;
    onSelect?: (selected: boolean) => void;
}

export function ModelCard({ model, selectedCapabilities, isSelected, onSelect }: ModelCardProps) {
    const [copied, setCopied] = useState(false);
    const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const providerColors: Record<string, string> = {
        OpenAI: "#000000",
        Anthropic: "#d97757",
        Google: "#4285F4",
        Mistral: "#f3c623",
        Cohere: "#C388E6",
        Meta: "#0668E1",
        xAI: "#71717a", // Zinc-500
        DeepSeek: "#4e61e6",
    };

    const baseBrandColor = providerColors[model.provider] || "#71717a";

    // Adjust OpenAI color in dark mode to be visible, but only after mount
    const brandColor = (mounted && model.provider === "OpenAI" && resolvedTheme === "dark")
        ? "#52525b" // Zinc-600
        : baseBrandColor;

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

        router.replace(`? ${params.toString()} `);
    };

    return (
        <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-all duration-500 ease-out"
            style={{
                boxShadow: "0 0 0 0 transparent",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 40px - 10px ${brandColor} 15`;
                e.currentTarget.style.borderColor = `${brandColor} 30`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "";
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {/* Comparison Checkbox */}
                    {onSelect && (
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => onSelect(e.target.checked)}
                                className="peer h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-600 dark:bg-zinc-800 cursor-pointer transition-all"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full border border-black/5 dark:border-white/10"
                            style={{ backgroundColor: brandColor }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {model.provider}
                        </span>
                        {model.status === "beta" && (
                            <span
                                className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                                style={{
                                    backgroundColor: `${brandColor} 15`,
                                    color: brandColor
                                }}
                            >
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
                    <a
                        href={model.source_url || "https://github.com/peteclt92/llm-api-reference/blob/master/data/models.json"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        Verified {model.last_verified}
                    </a>
                </div>
            </div>

            <details className="group mt-4" onToggle={(e) => setIsSnippetsOpen(e.currentTarget.open)}>
                <summary className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer select-none">
                    <Box size={16} />
                    <span>{isSnippetsOpen ? "Close Code Snippets" : "View Code Snippets"}</span>
                </summary>
                <div className="mt-2">
                    <ModelSnippets model={model} />
                </div>
            </details>
        </div>
    );
}
