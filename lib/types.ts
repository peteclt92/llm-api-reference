export interface Model {
  id: string;
  provider: string;
  model_name: string;
  api_string: string;
  pricing: {
    input_per_1m: number;
    output_per_1m: number;
  };
  context_window: number;
  capabilities: string[];
  last_verified: string;
  status: "active" | "deprecated" | "beta";
  description?: string;
  release_date?: string;
}
