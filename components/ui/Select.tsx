"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
    openDirection?: "up" | "down";
}

export function Select({ value, onChange, options, placeholder, className = "", icon, openDirection = "down" }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 px-4 flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-zinc-400">{icon}</span>}
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder || "Select..."}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className={`absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100 ${openDirection === "up" ? "bottom-full mb-2" : "mt-2"}`}>
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${option.value === value
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {option.icon && <span className="text-zinc-400">{option.icon}</span>}
                                    <span className="truncate">{option.label}</span>
                                </div>
                                {option.value === value && <Check size={14} className="text-zinc-900 dark:text-zinc-100" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
