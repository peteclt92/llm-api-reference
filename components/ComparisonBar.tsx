"use client";

import { Model } from "@/lib/types";
import { X, ArrowRightLeft } from "lucide-react";

interface ComparisonBarProps {
    selectedModels: Model[];
    onRemoveModel: (modelId: string) => void;
    onClear: () => void;
    onCompare: () => void;
}

export function ComparisonBar({ selectedModels, onRemoveModel, onClear, onCompare }: ComparisonBarProps) {
    if (selectedModels.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-zinc-800 dark:border-zinc-200">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">
                            {selectedModels.length} selected
                        </span>
                        <button
                            onClick={onClear}
                            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-100 dark:hover:text-zinc-900 underline"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="h-6 w-px bg-zinc-700 dark:bg-zinc-300 mx-2" />

                    <div className="flex items-center gap-2">
                        {selectedModels.map(model => (
                            <div key={model.id} className="flex items-center gap-2 bg-zinc-800 dark:bg-zinc-200 rounded-full pl-3 pr-2 py-1">
                                <span className="text-xs font-medium whitespace-nowrap max-w-[100px] truncate">
                                    {model.model_name}
                                </span>
                                <button
                                    onClick={() => onRemoveModel(model.id)}
                                    className="p-0.5 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onCompare}
                    disabled={selectedModels.length < 2}
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    <ArrowRightLeft size={16} />
                    Compare
                </button>
            </div>
        </div>
    );
}
