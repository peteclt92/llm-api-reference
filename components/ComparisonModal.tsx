"use client";

import { Model } from "@/lib/types";
import { X, Check, Minus } from "lucide-react";
import { useEffect } from "react";

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    models: Model[];
}

export function ComparisonModal({ isOpen, onClose, models }: ComparisonModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const formatPrice = (price: number) => `$${price.toFixed(2)}`;
    const formatContext = (ctx: number) => `${(ctx / 1000).toFixed(0)}k`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Model Comparison</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-auto flex-1 p-6">
                    <div className="grid gap-8" style={{ gridTemplateColumns: `150px repeat(${models.length}, minmax(200px, 1fr))` }}>
                        {/* Row Headers (Empty top-left) */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 pt-4"></div>

                        {/* Model Headers */}
                        {models.map(model => (
                            <div key={model.id} className="space-y-2">
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{model.provider}</div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{model.model_name}</h3>
                            </div>
                        ))}

                        {/* Context Window */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 py-4 border-t border-zinc-100 dark:border-zinc-800">Context Window</div>
                        {models.map(model => (
                            <div key={model.id} className="py-4 border-t border-zinc-100 dark:border-zinc-800 font-mono text-sm">
                                {formatContext(model.context_window)}
                            </div>
                        ))}

                        {/* Input Price */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 py-4 border-t border-zinc-100 dark:border-zinc-800">Input / 1M</div>
                        {models.map(model => (
                            <div key={model.id} className="py-4 border-t border-zinc-100 dark:border-zinc-800 font-mono text-sm">
                                {formatPrice(model.pricing.input_per_1m)}
                            </div>
                        ))}

                        {/* Output Price */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 py-4 border-t border-zinc-100 dark:border-zinc-800">Output / 1M</div>
                        {models.map(model => (
                            <div key={model.id} className="py-4 border-t border-zinc-100 dark:border-zinc-800 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {formatPrice(model.pricing.output_per_1m)}
                            </div>
                        ))}

                        {/* Capabilities */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 py-4 border-t border-zinc-100 dark:border-zinc-800">Capabilities</div>
                        {models.map(model => (
                            <div key={model.id} className="py-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex flex-wrap gap-1.5">
                                    {model.capabilities.map(cap => (
                                        <span key={cap} className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                            {cap}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Description */}
                        <div className="font-medium text-zinc-500 dark:text-zinc-400 py-4 border-t border-zinc-100 dark:border-zinc-800">Description</div>
                        {models.map(model => (
                            <div key={model.id} className="py-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {model.description}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
