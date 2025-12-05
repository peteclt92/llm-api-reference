import { Suspense } from "react";
import { ModelList } from "@/components/ModelList";
import { Header } from "@/components/Header";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";
import modelsData from "@/data/models.json";
import { Model } from "@/lib/types";

// Force dynamic rendering since we use searchParams
export const dynamic = "force-dynamic";

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  const models = modelsData as Model[];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 bg-grid">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center space-y-4">

            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Filter LLMs by capabilities, compare pricing, and get instant integration code.
            </p>
          </div>

          <Suspense fallback={<LoadingState />}>
            <ModelList models={models} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
