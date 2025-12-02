# LLM Model Reference Hub

A comprehensive, fast, and clean web application serving as the definitive reference for current top LLM API models.

## Features

### Core Experience
- **Model Directory**: Clean, responsive grid interface showing major LLM providers (OpenAI, Anthropic, Google, Mistral, etc.).
- **Detailed Model Cards**: Displays essential info like pricing (input/output per 1M tokens), context window, and key capabilities.
- **Code Snippets**: Ready-to-use, copy-pasteable snippets for Python, JavaScript, and cURL for every model.
- **llms.txt**: Machine-readable endpoint at `/llms.txt` following the [llmstxt.org](https://llmstxt.org) standard for AI agent consumption.

### Advanced Filtering & Search
- **Real-time Search**: Instantly filter models by name, provider, or API string.
- **Capability Filtering**: Clickable chips to filter models by specific capabilities (e.g., "Multimodal", "Coding", "Reasoning").
- **Multi-Chip Support**: Select multiple capabilities to find models that match *all* criteria.
- **URL Persistence**: All filters (search, provider, capabilities) are synced to the URL, making views easily shareable.

### Technical
- **Dark Mode**: Fully responsive design with automatic dark mode support.
- **Static Optimization**: Built with Next.js App Router for maximum performance.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd llm-reference-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Path to Full Automation

The project currently includes a skeleton script (`scripts/update_models.ts`) for automated updates. To achieve full automation, the following steps are required:

### 1. Search API Integration
- **Missing**: Integration with a web search API (e.g., Tavily, Brave Search, or Perplexity).
- **Goal**: The script needs to actively search for queries like "OpenAI GPT-4o pricing", "Anthropic Claude 3.5 release date", etc.

### 2. Content Parsing & Extraction
- **Missing**: Logic to parse search results or scrape official documentation pages.
- **Goal**: Extract structured data (pricing, context window, model names) from unstructured web content.

### 3. Verification & Diffing
- **Missing**: Logic to compare fetched data against the existing `data/models.json`.
- **Goal**: Identify discrepancies (e.g., price drops, new models) and generate a diff.

### 4. Alerting / PR Creation
- **Missing**: Integration with GitHub API or a notification service.
- **Goal**: Automatically create a Pull Request with the updated JSON data or send an alert (Slack/Discord) for human review when changes are detected.

### Current Automation Status
The `scripts/update_models.ts` file currently loads the local data and iterates through it, serving as a placeholder for the logic described above.

To run the current script:
```bash
npx tsx scripts/update_models.ts
```

## Adding Models Manually

To manually add a model, edit `data/models.json`. The schema is defined in `lib/types.ts`.

## Deployment

This project is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Deploy.

## License

MIT
