import { NextResponse } from "next/server";
import modelsData from "@/data/models.json";
import { Model } from "@/lib/types";

const models: Model[] = modelsData as Model[];

export async function GET() {
    let content = "# LLM Model Reference\n";
    content += "# See https://llmstxt.org for format details\n\n";

    // Group by provider
    const providers = Array.from(new Set(models.map((m) => m.provider))).sort();

    for (const provider of providers) {
        content += `## ${provider}\n\n`;
        const providerModels = models.filter((m) => m.provider === provider);

        for (const model of providerModels) {
            content += `- ${model.model_name} (${model.api_string})\n`;
            content += `  - Context: ${(model.context_window / 1000).toLocaleString()}k\n`;
            content += `  - Input: $${model.pricing.input_per_1m.toFixed(2)}/1M\n`;
            content += `  - Output: $${model.pricing.output_per_1m.toFixed(2)}/1M\n`;
            if (model.description) {
                content += `  - Description: ${model.description}\n`;
            }
            content += "\n";
        }
    }

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
