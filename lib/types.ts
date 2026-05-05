export type AIEngine = "gpt" | "claude" | "gemini";

export interface DiagnoseRequest {
  productName: string;
  query: string;
  competitors?: string[];
}

export interface EngineResponse {
  engine: AIEngine;
  rawResponse: string;
  mentioned: boolean;
  rank: number | null;
  sentiment: "positive" | "neutral" | "negative" | "not_mentioned";
  mentionedCompetitors: string[];
  snippet: string;
}

export interface CompetitorStat {
  name: string;
  mentionCount: number;
  engines: AIEngine[];
}

export interface ReportCard {
  productName: string;
  query: string;
  overallScore: number;
  visibilityGrade: "A" | "B" | "C" | "D" | "F";
  engines: EngineResponse[];
  topCompetitors: CompetitorStat[];
  recommendations: string[];
  timestamp: string;
}
