"use client";

import { useMemo } from "react";
import { Model } from "@/lib/types";
import { ModelCard } from "./ModelCard";
import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ModelListProps {
    models: Model[];
}

export function ModelList({ models }: ModelListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const selectedProvider = searchParams.get("provider") || "all";
    const capabilityParam = searchParams.get("capability") || "";
    const selectedCapabilities = useMemo(() => {
        return capabilityParam ? capabilityParam.split(",") : [];
    }, [capabilityParam]);

    const providers = useMemo(() => {
        const uniqueProviders = Array.from(new Set(models.map((m) => m.provider)));
        return ["all", ...uniqueProviders.sort()];
    }, [models]);

    const filteredModels = useMemo(() => {
        return models.filter((model) => {
            const matchesSearch =
                model.model_name.toLowerCase().includes(search.toLowerCase()) ||
                model.api_string.toLowerCase().includes(search.toLowerCase()) ||
                model.provider.toLowerCase().includes(search.toLowerCase());

            const matchesProvider =
                selectedProvider === "all" || model.provider === selectedProvider;

            // Check if model has ALL selected capabilities
            const matchesCapabilities =
                selectedCapabilities.length === 0 ||
                selectedCapabilities.every(cap => model.capabilities.includes(cap));

            return matchesSearch && matchesProvider && matchesCapabilities;
        });
    }, [models, search, selectedProvider, selectedCapabilities]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const removeCapability = (capability: string) => {
        const newCapabilities = selectedCapabilities.filter(c => c !== capability);
        updateFilter("capability", newCapabilities.join(","));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <select
                        value={selectedProvider}
                        onChange={(e) => updateFilter("provider", e.target.value)}
                        className="w-full pl-10 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 appearance-none cursor-pointer"
                    >
                        <option value="all">All Providers</option>
                        {providers.map((provider) => (
                            <option key={provider} value={provider}>
                                {provider}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedCapabilities.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Filtering by:</span>
                    {selectedCapabilities.map(cap => (
                        <button
                            key={cap}
                            onClick={() => removeCapability(cap)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
                        >
                            {cap}
                            <X size={14} />
                        </button>
                    ))}
                    <button
                        onClick={() => updateFilter("capability", "")}
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline ml-2"
                    >
                        Clear all
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                    <ModelCard
                        key={model.id}
                        model={model}
                        selectedCapabilities={selectedCapabilities}
                    />
                ))}
            </div>

            {filteredModels.length === 0 && (
                <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                    No models found matching your criteria.
                </div>
            )}
        </div>
    );
}
