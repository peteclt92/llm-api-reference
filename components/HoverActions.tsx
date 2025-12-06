"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Link, Scale, Check } from "lucide-react";
import { Model } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface HoverActionsProps {
    model: Model;
    onAddToCompare?: () => void;
    className?: string;
}

export function HoverActions({ model, onAddToCompare, className = "" }: HoverActionsProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = useCallback(async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    }, []);

    const actions = [
        {
            id: "api",
            icon: copiedId === "api" ? <Check size={14} /> : <Copy size={14} />,
            label: "Copy API ID",
            onClick: () => copyToClipboard(model.api_string, "api"),
        },
        {
            id: "link",
            icon: copiedId === "link" ? <Check size={14} /> : <Link size={14} />,
            label: "Copy Link",
            onClick: () => copyToClipboard(`${window.location.origin}?search=${encodeURIComponent(model.api_string)}`, "link"),
        },
        ...(onAddToCompare ? [{
            id: "compare",
            icon: <Scale size={14} />,
            label: "Compare",
            onClick: onAddToCompare,
        }] : []),
    ];

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                    }}
                    className="p-2 rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm hover:shadow-md"
                    title={action.label}
                >
                    {action.icon}
                </button>
            ))}
        </div>
    );
}

// Hook for long-press detection on mobile
export function useLongPress(callback: () => void, delay: number = 500) {
    const [isLongPress, setIsLongPress] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isActive = useRef(false);

    const start = useCallback(() => {
        isActive.current = true;
        timerRef.current = setTimeout(() => {
            if (isActive.current) {
                setIsLongPress(true);
                callback();
            }
        }, delay);
    }, [callback, delay]);

    const stop = useCallback(() => {
        isActive.current = false;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // Delay resetting to allow click handlers to check
        setTimeout(() => setIsLongPress(false), 50);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        isLongPress,
        handlers: {
            onMouseDown: start,
            onMouseUp: stop,
            onMouseLeave: stop,
            onTouchStart: start,
            onTouchEnd: stop,
        },
    };
}
