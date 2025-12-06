"use client";

import { useMemo, useState, useEffect } from "react";
import { ComparisonBar } from "./ComparisonBar";
import { ComparisonModal } from "./ComparisonModal";
import { Model } from "@/lib/types";
import { ModelCard } from "./ModelCard";
import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FadeIn } from "./FadeIn";
import { Select } from "./ui/Select";
import { ModelDetailsSheet } from "./ModelDetailsSheet";

interface ModelListProps {
    models: Model[];
}

export function ModelList({ models }: ModelListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedModelForDetails, setSelectedModelForDetails] = useState<Model | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            // Show background when scrolled past 100px (roughly when docked to header)
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check initial state
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const search = searchParams.get("search") || "";
    const selectedProvider = searchParams.get("provider") || "all";
    const capabilityParam = searchParams.get("capability") || "";
    const selectedCapabilities = useMemo(() => {
        return capabilityParam ? capabilityParam.split(",") : [];
    }, [capabilityParam]);

    // Calculate minimum price from all models
    const minModelPrice = useMemo(() => {
        const prices = models.map(m => m.pricing.output_per_1m);
        return Math.min(...prices);
    }, [models]);

    // Calculate maximum price from all models
    const maxModelPrice = useMemo(() => {
        const prices = models.map(m => m.pricing.output_per_1m);
        return Math.max(...prices);
    }, [models]);

    // Read maxPrice from URL params or default to max model price
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = useMemo(() => {
        return maxPriceParam ? Number(maxPriceParam) : maxModelPrice;
    }, [maxPriceParam, maxModelPrice]);

    const sortBy = searchParams.get("sort") || "recommended";

    const providers = useMemo(() => {
        const uniqueProviders = Array.from(new Set(models.map((m) => m.provider)));
        return uniqueProviders.sort();
    }, [models]);

    const filteredModels = useMemo(() => {
        let result = models.filter((model) => {
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

            const matchesPrice = model.pricing.output_per_1m <= maxPrice;

            return matchesSearch && matchesProvider && matchesCapabilities && matchesPrice;
        });

        // Sorting Logic
        return result.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.pricing.output_per_1m - b.pricing.output_per_1m;
                case "price-high":
                    return b.pricing.output_per_1m - a.pricing.output_per_1m;
                case "context":
                    return b.context_window - a.context_window;
                case "newest":
                    return new Date(b.last_verified).getTime() - new Date(a.last_verified).getTime();
                case "name":
                    return a.model_name.localeCompare(b.model_name);
                default: // "recommended" - keep original order
                    return 0;
            }
        });
    }, [models, search, selectedProvider, selectedCapabilities, maxPrice, sortBy]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "recommended") {
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
        <div className="space-y-8">
            {/* Desktop Filter Bar (Sticky Top) - Hidden on Mobile */}
            <div className={`hidden md:block sticky top-16 z-40 py-4 -mx-4 px-4 mb-6 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50" : ""}`}>
                <div className="flex flex-col gap-4">
                    {/* Top Row: Search */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={search}
                            onChange={(e) => updateFilter("search", e.target.value)}
                            className="w-full pl-10 pr-10 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-sm"
                        />
                        {search && (
                            <button
                                onClick={() => updateFilter("search", "")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Bottom Row: Filters & Sort */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 w-full md:w-auto flex-wrap md:flex-nowrap">
                            <div className="min-w-[180px] w-full md:w-auto">
                                <Select
                                    value={selectedProvider}
                                    onChange={(val) => updateFilter("provider", val)}
                                    options={[
                                        { value: "all", label: "All Providers" },
                                        ...providers.map(p => ({ value: p, label: p }))
                                    ]}
                                    icon={<Filter size={14} />}
                                />
                            </div>

                            <div className="min-w-[180px] w-full md:w-auto">
                                <Select
                                    value={sortBy}
                                    onChange={(val) => updateFilter("sort", val)}
                                    options={[
                                        { value: "recommended", label: "Recommended" },
                                        { value: "price-low", label: "Price: Low to High" },
                                        { value: "price-high", label: "Price: High to Low" },
                                        { value: "context", label: "Context Window" },
                                        { value: "newest", label: "Newest Added" },
                                        { value: "name", label: "Name (A-Z)" },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-4 h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-w-[240px] w-full md:w-auto">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                Max Price (1M): <span className="font-mono inline-block min-w-[2.5rem] text-right">${maxPrice}</span>
                            </span>
                            <input
                                type="range"
                                min={minModelPrice}
                                max={maxModelPrice}
                                step="0.1"
                                value={maxPrice}
                                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Thumb-Reach Control Island (Fixed Bottom) */}
            <MobileControlIsland
                search={search}
                updateFilter={updateFilter}
                selectedProvider={selectedProvider}
                providers={providers}
                sortBy={sortBy}
                maxPrice={maxPrice}
                minModelPrice={minModelPrice}
                maxModelPrice={maxModelPrice}
            />

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
                {filteredModels.map((model, index) => (
                    <FadeIn key={model.id} delay={(index % 3) * 100}>
                        <ModelCard
                            model={model}
                            selectedCapabilities={selectedCapabilities}
                            onShowDetails={() => setSelectedModelForDetails(model)}
                        />
                    </FadeIn>
                ))}
            </div>

            {filteredModels.length === 0 && (
                <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                    No models found matching your criteria.
                </div>
            )}

            <ModelDetailsSheet
                model={selectedModelForDetails}
                onClose={() => setSelectedModelForDetails(null)}
            />
        </div>
    );
}

function MobileControlIsland({
    search,
    updateFilter,
    selectedProvider,
    providers,
    sortBy,
    maxPrice,
    minModelPrice,
    maxModelPrice
}: {
    search: string;
    updateFilter: (key: string, value: string) => void;
    selectedProvider: string;
    providers: string[];
    sortBy: string;
    maxPrice: number;
    minModelPrice: number;
    maxModelPrice: number;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Never hide the bar if it's expanded
            if (isExpanded) {
                setIsVisible(true);
                return;
            }

            const currentScrollY = window.scrollY;

            // Show when scrolling up or at top, hide when scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isExpanded]);

    // Always visible when expanded
    const shouldShow = isVisible || isExpanded;

    return (
        // Use larger bottom margin + safe-area for iOS Safari
        <div
            className={`md:hidden fixed left-4 right-4 z-50 transition-transform duration-300 ${shouldShow ? "translate-y-0" : "translate-y-[150%]"}`}
            style={{ bottom: 'max(env(safe-area-inset-bottom, 24px), 24px)' }}
        >
            <div
                className={`bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl overflow-visible transition-all duration-300 ease-spring ${isExpanded ? "p-4" : "p-2"}`}
            >
                {!isExpanded ? (
                    // Collapsed Pill State
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center justify-between h-12 px-2 cursor-pointer"
                    >
                        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Search size={20} />
                            </div>
                            <span className="font-medium">Search & Filter...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {(search || selectedProvider !== 'all') && (
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            )}
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                                <Filter size={20} />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Expanded State
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-200 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Filters</h3>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search models..."
                                value={search}
                                onChange={(e) => updateFilter("search", e.target.value)}
                                className="w-full pl-10 pr-10 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 gap-3">
                            <Select
                                value={selectedProvider}
                                onChange={(val) => updateFilter("provider", val)}
                                options={[
                                    { value: "all", label: "All Providers" },
                                    ...providers.map(p => ({ value: p, label: p }))
                                ]}
                                icon={<Filter size={14} />}
                                openDirection="up"
                            />

                            <Select
                                value={sortBy}
                                onChange={(val) => updateFilter("sort", val)}
                                options={[
                                    { value: "recommended", label: "Recommended" },
                                    { value: "price-low", label: "Price: Low to High" },
                                    { value: "price-high", label: "Price: High to Low" },
                                    { value: "context", label: "Context Window" },
                                    { value: "newest", label: "Newest Added" },
                                    { value: "name", label: "Name (A-Z)" },
                                ]}
                                openDirection="up"
                            />
                        </div>

                        {/* Price Slider */}
                        <div className="flex items-center gap-3 px-4 h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 w-full">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                Max: <span className="font-mono">${maxPrice}</span>
                            </span>
                            <input
                                type="range"
                                min={minModelPrice}
                                max={maxModelPrice}
                                step="0.1"
                                value={maxPrice}
                                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
