"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Link, Scale, Check, MoreHorizontal } from "lucide-react";
import { Model } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";

interface HoverActionsProps {
    model: Model;
    onAddToCompare?: () => void;
    className?: string;
}

export function HoverActions({ model, onAddToCompare, className = "" }: HoverActionsProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const copyToClipboard = useCallback(async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const actions = [
        {
            id: "api",
            icon: copiedId === "api" ? <Check size={14} /> : <Copy size={14} />,
            label: copiedId === "api" ? "Copied!" : "Copy API ID",
            onClick: () => copyToClipboard(model.api_string, "api"),
        },
        {
            id: "link",
            icon: copiedId === "link" ? <Check size={14} /> : <Link size={14} />,
            label: copiedId === "link" ? "Copied!" : "Copy Link",
            onClick: () => copyToClipboard(`${window.location.origin}?search=${encodeURIComponent(model.api_string)}`, "link"),
        },
        ...(onAddToCompare ? [{
            id: "compare",
            icon: <Scale size={14} />,
            label: "Add to Compare",
            onClick: onAddToCompare,
        }] : []),
    ];

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-all"
                title="Quick actions"
            >
                <MoreHorizontal size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl py-1 min-w-[140px]"
                    >
                        {actions.map((action) => (
                            <button
                                key={action.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                    if (action.id !== "compare") {
                                        // Keep menu open for copy feedback
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                {action.icon}
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
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
