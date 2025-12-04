import { Box } from "lucide-react";

export function ModelCardSkeleton() {
    return (
        <div className="group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>

            <div className="mb-4">
                <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/50">
                <div>
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 animate-pulse" />
                    <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="text-right">
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 ml-auto animate-pulse" />
                    <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto animate-pulse" />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
        </div>
    );
}
