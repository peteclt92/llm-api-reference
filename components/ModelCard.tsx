import { Model } from "@/lib/types";
import { Copy, Check, Calendar, Code2, ChevronDown, Plus, FileJson } from "lucide-react";
import { useState, useEffect } from "react";
import { ModelSnippets } from "./ModelSnippets";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface ModelCardProps {
    model: Model;
    selectedCapabilities: string[];
    isSelected?: boolean;
    onSelect?: (selected: boolean) => void;
    onShowDetails?: () => void;
    sortBy?: string; // Current sort mode
}

export function ModelCard({ model, selectedCapabilities, isSelected, onSelect, onShowDetails, sortBy }: ModelCardProps) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme();

    // Gesture State
    const x = useMotionValue(0);
    const backgroundOpacityLeft = useTransform(x, [50, 100], [0, 1]);
    const backgroundOpacityRight = useTransform(x, [-50, -100], [0, 1]);
    const [swipeAction, setSwipeAction] = useState<"compare" | "copy" | null>(null);

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
        ? "#ffffff" // White for better contrast
        : baseBrandColor;

    // Base glass color for inline styles (hydration safe)
    const baseGlassColor = (mounted && resolvedTheme === "dark") ? "0, 0, 0" : "255, 255, 255";

    const copyToClipboard = (text: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleCapability = (capability: string, e: React.MouseEvent) => {
        e.stopPropagation();
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

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            // Swiped Right -> Compare
            if (onSelect) onSelect(!isSelected);
        } else if (info.offset.x < -100) {
            // Swiped Left -> Copy ID
            copyToClipboard(model.api_string);
        }
    };

    return (
        <div className="relative w-full h-full">
            {/* Swipe Backgrounds */}
            <div className="absolute inset-0 flex items-center justify-between px-8 z-0 rounded-xl overflow-hidden">
                {/* Left: Compare (Green) */}
                <motion.div
                    style={{ opacity: backgroundOpacityLeft }}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg"
                >
                    <Plus size={24} />
                    <span>{isSelected ? "Remove" : "Compare"}</span>
                </motion.div>

                {/* Right: Copy (Gray) */}
                <motion.div
                    style={{ opacity: backgroundOpacityRight }}
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-bold text-lg"
                >
                    <span>Copy ID</span>
                    <Copy size={24} />
                </motion.div>
            </div>

            <motion.div
                layout
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{
                    x,
                    // Outer Glass Layer Settings
                    backdropFilter: `blur(var(--glass-blur, 24px))`,
                    WebkitBackdropFilter: `blur(var(--glass-blur, 24px))`,
                    backgroundColor: isExpanded || isSelected
                        ? `rgba(${baseGlassColor}, calc(var(--glass-bg-opacity, 0.03) + 0.12))`
                        : `rgba(${baseGlassColor}, var(--glass-bg-opacity, 0.03))`,
                    // borderColor: Outer border removed as requested
                    boxShadow: `0 8px 32px rgba(0, 0, 0, var(--glass-shadow-opacity, 0.09))`,
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    rounded-[24px] p-1.5 cursor-pointer relative group z-10
                    transition-all duration-300
                    dark:!bg-[rgba(0,0,0,calc(var(--glass-bg-opacity,0.03)+${isExpanded || isSelected ? 0.12 : 0}))]
                    dark:!shadow-[0_8px_32px_rgba(0,0,0,var(--glass-shadow-opacity,0.03))]
                    ${isExpanded || isSelected ? 'shadow-xl' : ''}
                `}
                // Removed scale on hover as requested
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Inner Content Capsule - The second stacked layer */}
                <div
                    className="
                        relative h-full w-full rounded-[18px] overflow-hidden
                        bg-[rgba(255,255,255,var(--glass-bg-opacity,0.03))] dark:bg-[rgba(0,0,0,var(--glass-bg-opacity,0.03))]
                        border border-white/30 dark:border-white/10
                        transition-colors duration-300
                    "
                >
                    {/* Subtle inner glow for glass effect */}
                    <div className="absolute -inset-16 z-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none transition-transform duration-700 ease-out group-hover:translate-x-12 group-hover:translate-y-12" />

                    {/* Header / Always Visible Part */}
                    <div className="relative z-10 p-5">
                        {/* Provider Row */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                {/* Comparison Checkbox - Only visible when expanded */}
                                {onSelect && isExpanded && (
                                    <div className="relative flex items-center pt-0.5" onClick={(e) => e.stopPropagation()}>
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
                                    {(sortBy === "newest" || sortBy === "oldest") && model.release_date && (
                                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">
                                            {model.release_date.replace("-", " / ")}
                                        </span>
                                    )}
                                    {model.status === "beta" && (
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                                            style={{
                                                backgroundColor: `${brandColor}15`,
                                                color: brandColor
                                            }}
                                        >
                                            BETA
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Context */}
                            <div className="text-right flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">Context</span>
                                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                                        {model.context_window >= 1000000
                                            ? `${(model.context_window / 1000000).toFixed(0)}M`
                                            : `${(model.context_window / 1000).toLocaleString()}k`}
                                    </span>
                                </div>
                                {/* Context Bar */}
                                <div className="h-1 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full opacity-50"
                                        style={{
                                            width: `${Math.min((model.context_window / 2000000) * 100, 100)}%`,
                                            backgroundColor: brandColor
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Model Name & Output Price Row */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                {model.model_name}
                            </h3>

                            {/* Right Side: Output Price */}
                            <div className="text-right flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500">Output/1M</span>
                                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                                        ${model.pricing.output_per_1m.toFixed(2)}
                                    </span>
                                </div>
                                {/* Price Bar */}
                                <div className="h-1 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full opacity-50"
                                        style={{
                                            width: `${Math.min((model.pricing.output_per_1m / 30) * 100, 100)}%`,
                                            backgroundColor: brandColor
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="relative z-10 px-6 pb-6 pt-0 space-y-6 mt-2">
                                    {/* API String */}
                                    <div className="pt-4">
                                        <div className="flex items-center justify-between bg-zinc-50 dark:bg-white/5 rounded-md p-3 border border-zinc-100 dark:border-white/10 group" onClick={(e) => e.stopPropagation()}>
                                            <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 truncate mr-2 select-all">
                                                {model.api_string}
                                            </code>
                                            <button
                                                onClick={(e) => copyToClipboard(model.api_string, e)}
                                                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                                title="Copy API String"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detailed Pricing */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Input / 1M</div>
                                            <div className="font-medium text-zinc-900 dark:text-zinc-100 text-lg">
                                                ${model.pricing.input_per_1m.toFixed(2)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Output / 1M</div>
                                            <div className="font-medium text-zinc-900 dark:text-zinc-100 text-lg">
                                                ${model.pricing.output_per_1m.toFixed(2)}
                                            </div>
                                        </div>
                                        {model.release_date && (
                                            <div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Released</div>
                                                <div className="font-medium text-zinc-900 dark:text-zinc-100 text-lg">
                                                    {model.release_date.replace("-", " / ")}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Capabilities */}
                                    <div className="flex flex-wrap gap-2">
                                        {model.capabilities.map((cap) => (
                                            <button
                                                key={cap}
                                                onClick={(e) => toggleCapability(cap, e)}
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${selectedCapabilities.includes(cap)
                                                    ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700/50 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                    }`}
                                            >
                                                {cap}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <a
                                                href={model.source_url || "https://github.com/peteclt92/llm-api-reference/blob/master/data/models.json"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Verified {model.last_verified}
                                            </a>
                                        </div>
                                        {onShowDetails && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onShowDetails();
                                                }}
                                                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                            >
                                                <Code2 size={14} />
                                                Code Snippets
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expand Hint (Visible on Hover/Rest) */}
                    {!isExpanded && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 dark:text-zinc-400">
                            <ChevronDown size={16} />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
