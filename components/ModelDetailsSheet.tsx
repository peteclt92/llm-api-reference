import { Model } from "@/lib/types";
import { X, FileJson, Code, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ModelSnippets } from "./ModelSnippets";

interface ModelDetailsSheetProps {
    model: Model | null;
    onClose: () => void;
}

export function ModelDetailsSheet({ model, onClose }: ModelDetailsSheetProps) {
    const [activeTab, setActiveTab] = useState<"snippets" | "json">("snippets");
    const [copied, setCopied] = useState(false);

    const copyJson = () => {
        if (model) {
            navigator.clipboard.writeText(JSON.stringify(model, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {model && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-white dark:bg-zinc-900 rounded-t-[2rem] shadow-2xl border-t border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden flex flex-col"
                    >
                        {/* Drag Handle */}
                        <div className="w-full h-8 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-6 pb-4 flex items-start justify-between shrink-0">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                    {model.provider}
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {model.model_name}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 border-b border-zinc-100 dark:border-zinc-800 flex gap-6 shrink-0">
                            <button
                                onClick={() => setActiveTab("snippets")}
                                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "snippets"
                                    ? "text-zinc-900 dark:text-zinc-100"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Code size={16} />
                                    Code Snippets
                                </div>
                                {activeTab === "snippets" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("json")}
                                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "json"
                                    ? "text-zinc-900 dark:text-zinc-100"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FileJson size={16} />
                                    Raw JSON
                                </div>
                                {activeTab === "json" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
                            {activeTab === "snippets" ? (
                                <div className="max-w-3xl mx-auto">
                                    <ModelSnippets model={model} />
                                </div>
                            ) : (
                                <div className="max-w-3xl mx-auto relative">
                                    <div className="absolute right-2 top-2">
                                        <button
                                            onClick={copyJson}
                                            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shadow-sm"
                                            title="Copy JSON"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 pt-10 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all border border-zinc-200 dark:border-zinc-800">
                                        {JSON.stringify(model, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
