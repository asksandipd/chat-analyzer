export interface ProblemSolution {
  problem: string;
  solution: string;
}

export interface AnalysisResult {
  results?: ProblemSolution[];
  error?: string;
}

export type ModelProvider = 'openai' | 'ollama';

export interface ModelConfig {
  provider: ModelProvider;
  openaiModel: string;
  ollamaModel: string;
  ollamaUrl: string;
} 