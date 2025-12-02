import { Header } from "@/components/Header";
import { ModelList } from "@/components/ModelList";
import modelsData from "@/data/models.json";
import { Model } from "@/lib/types";
import { Suspense } from "react";

// Ensure data matches the type
const models: Model[] = modelsData as Model[];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            LLM API Reference
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            The definitive reference for top LLM API models.
            Always up-to-date model names, pricing, and capabilities.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-zinc-500 dark:text-zinc-400">Loading models...</div>}>
          <ModelList models={models} />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-12 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Data updated weekly. Last check: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}
