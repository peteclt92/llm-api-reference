"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { X, Sliders, Image as ImageIcon } from "lucide-react";

interface GlassSettings {
    bgOpacity: number;
    blurAmount: number;
    borderOpacity: number;
    shadowOpacity: number;
}

const defaultSettings: GlassSettings = {
    bgOpacity: 3,
    blurAmount: 24,
    borderOpacity: 50,
    shadowOpacity: 3,
};

const backgrounds = [
    { id: "dots", name: "Dots (Default)", value: "default" },
    // Gradients
    { id: "gradient-warm", name: "Warm Gradient", value: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)" },
    { id: "gradient-cool", name: "Cool Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "gradient-nature", name: "Nature Gradient", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { id: "gradient-sunset", name: "Sunset", value: "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)" },
    { id: "gradient-ocean", name: "Ocean", value: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)" },
    { id: "gradient-forest", name: "Forest", value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
    { id: "gradient-midnight", name: "Midnight (Dark)", value: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)" },
    { id: "gradient-space", name: "Deep Space (Dark)", value: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, #000000, #434343)" },
    { id: "gradient-aurora", name: "Aurora (Dark)", value: "linear-gradient(to right, #000000, #0f9b0f)" },
    // Images
    { id: "image-meadow", name: "Meadow", value: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80')" },
    { id: "image-abstract", name: "Abstract", value: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80')" },
    { id: "image-mountains", name: "Mountains", value: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')" },
    { id: "image-cyberpunk", name: "Cyberpunk", value: "url('https://images.unsplash.com/photo-1515630278258-407f66498911?w=1920&q=80')" },
    { id: "image-geometry", name: "Geometry", value: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&q=80')" },
];

// Custom slider styles
const sliderStyles = `
    .debug-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 6px;
        background: #3f3f46;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
    }
    .debug-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #ffffff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.1s ease;
    }
    .debug-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
    }
    .debug-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #ffffff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
`;

export function DebugPanel() {
    const searchParams = useSearchParams();
    const isDebug = searchParams.get("debug") !== null;

    const [isOpen, setIsOpen] = useState(true);
    const [settings, setSettings] = useState<GlassSettings>(defaultSettings);
    const [selectedBg, setSelectedBg] = useState("gradient-space");
    const [customUrl, setCustomUrl] = useState("");

    // Add custom URL handler
    const applyCustomUrl = () => {
        if (!customUrl) return;
        setSelectedBg("custom");
    };

    // Apply CSS variables for glass settings
    useEffect(() => {
        if (!isDebug) return;

        document.documentElement.style.setProperty("--glass-bg-opacity", `${settings.bgOpacity / 100}`);
        document.documentElement.style.setProperty("--glass-blur", `${settings.blurAmount}px`);
        document.documentElement.style.setProperty("--glass-border-opacity", `${settings.borderOpacity / 100}`);
        document.documentElement.style.setProperty("--glass-shadow-opacity", `${settings.shadowOpacity / 100}`);

        return () => {
            document.documentElement.style.removeProperty("--glass-bg-opacity");
            document.documentElement.style.removeProperty("--glass-blur");
            document.documentElement.style.removeProperty("--glass-border-opacity");
            document.documentElement.style.removeProperty("--glass-shadow-opacity");
        };
    }, [isDebug, settings]);

    // Apply background - target the main page container
    useEffect(() => {
        if (!isDebug) return;

        const pageContainer = document.querySelector('[data-page-container]') as HTMLElement;

        // Handle custom URL separately
        if (selectedBg === "custom") {
            if (pageContainer && customUrl) {
                pageContainer.style.background = `url('${customUrl}')`;
                pageContainer.style.backgroundSize = "cover";
                pageContainer.style.backgroundPosition = "center";
                pageContainer.style.backgroundAttachment = "fixed";
            }
            return;
        }

        const bg = backgrounds.find(b => b.id === selectedBg);
        if (!bg) return;

        if (bg.value === "default") {
            // Reset to default
            if (pageContainer) {
                pageContainer.style.background = "";
                pageContainer.style.backgroundImage = "";
                pageContainer.style.backgroundSize = "";
                pageContainer.style.backgroundPosition = "";
                pageContainer.style.backgroundAttachment = "";
            }
        } else if (bg.value.startsWith("url(")) {
            if (pageContainer) {
                // Clear any existing classes that might set background
                pageContainer.style.background = bg.value;
                pageContainer.style.backgroundSize = "cover";
                pageContainer.style.backgroundPosition = "center";
                pageContainer.style.backgroundAttachment = "fixed";
                // Ensure grid is removed
                pageContainer.style.backgroundImage = bg.value;
            }
        } else {
            if (pageContainer) {
                pageContainer.style.background = bg.value;
                pageContainer.style.backgroundSize = "cover"; // Ensure gradients stretch
                pageContainer.style.backgroundAttachment = "fixed";
                // Ensure grid is removed
                pageContainer.style.backgroundImage = bg.value;
            }
        }

        return () => {
            if (pageContainer) {
                pageContainer.style.background = "";
                pageContainer.style.backgroundSize = "";
                pageContainer.style.backgroundPosition = "";
                pageContainer.style.backgroundAttachment = "";
            }
        };
    }, [isDebug, selectedBg, customUrl]);

    if (!isDebug) return null;

    const updateSetting = (key: keyof GlassSettings, value: number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        setSelectedBg("dots");
        setCustomUrl("");
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[100] p-3 bg-black text-white rounded-full shadow-lg hover:bg-zinc-800 transition-colors"
                title="Open Debug Panel"
            >
                <Sliders size={20} />
            </button>
        );
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
            <div className="fixed bottom-4 right-4 z-[100] w-80 bg-zinc-900 text-white rounded-xl shadow-2xl overflow-hidden font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
                    <div className="flex items-center gap-2">
                        <Sliders size={16} />
                        <span className="font-semibold text-sm">Glass Debug Panel</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-zinc-700 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Background Switcher */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ImageIcon size={14} />
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Background</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {backgrounds.map(bg => (
                                <button
                                    key={bg.id}
                                    onClick={() => setSelectedBg(bg.id)}
                                    className={`px-3 py-2 text-xs rounded-lg transition-all text-left truncate ${selectedBg === bg.id
                                        ? "bg-white text-black font-medium"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        }`}
                                >
                                    {bg.name}
                                </button>
                            ))}
                        </div>

                        {/* Custom URL Input */}
                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                placeholder="Custom Image URL..."
                                className="flex-1 px-3 py-2 bg-zinc-800 rounded-lg text-xs text-zinc-200 border border-zinc-700 focus:border-zinc-500 outline-none"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && applyCustomUrl()}
                            />
                            <button
                                onClick={applyCustomUrl}
                                className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-700" />

                    {/* Sliders */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Sliders size={14} />
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Glass Settings</span>
                        </div>

                        {/* Background Opacity */}
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-zinc-400">Background Opacity</span>
                                <span className="font-mono text-zinc-300">{settings.bgOpacity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.bgOpacity}
                                onChange={(e) => updateSetting("bgOpacity", Number(e.target.value))}
                                className="debug-slider"
                            />
                        </div>

                        {/* Blur Amount */}
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-zinc-400">Blur Amount</span>
                                <span className="font-mono text-zinc-300">{settings.blurAmount}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="48"
                                value={settings.blurAmount}
                                onChange={(e) => updateSetting("blurAmount", Number(e.target.value))}
                                className="debug-slider"
                            />
                        </div>

                        {/* Border Opacity */}
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-zinc-400">Border Opacity</span>
                                <span className="font-mono text-zinc-300">{settings.borderOpacity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.borderOpacity}
                                onChange={(e) => updateSetting("borderOpacity", Number(e.target.value))}
                                className="debug-slider"
                            />
                        </div>

                        {/* Shadow Opacity */}
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-zinc-400">Shadow Opacity</span>
                                <span className="font-mono text-zinc-300">{settings.shadowOpacity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={settings.shadowOpacity}
                                onChange={(e) => updateSetting("shadowOpacity", Number(e.target.value))}
                                className="debug-slider"
                            />
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetSettings}
                        className="w-full py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Reset to Defaults
                    </button>

                    {/* Current Values Display */}
                    <div className="p-3 bg-zinc-800 rounded-lg font-mono text-[10px] text-zinc-400 space-y-1">
                        <div>--glass-bg-opacity: {(settings.bgOpacity / 100).toFixed(2)}</div>
                        <div>--glass-blur: {settings.blurAmount}px</div>
                        <div>--glass-border-opacity: {(settings.borderOpacity / 100).toFixed(2)}</div>
                        <div>--glass-shadow-opacity: {(settings.shadowOpacity / 100).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
