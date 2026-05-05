import { NextRequest, NextResponse } from "next/server";
import { analyzeResponse } from "@/lib/analyzeResponse";
import { queryAllEngines } from "@/lib/queryEngines";
import {
  calculateScore,
  extractTopCompetitors,
  generateRecommendations,
  gradeFromScore
} from "@/lib/scoreCalculator";
import { DiagnoseRequest, ReportCard } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DiagnoseRequest;
    const { productName, query, competitors = [] } = body;

    if (!productName || !query) {
      return NextResponse.json({ error: "productName and query are required" }, { status: 400 });
    }

    const rawResponses = await queryAllEngines(query);

    const engines = [
      analyzeResponse("gpt", rawResponses.gpt, productName, competitors),
      analyzeResponse("claude", rawResponses.claude, productName, competitors),
      analyzeResponse("gemini", rawResponses.gemini, productName, competitors)
    ];

    const overallScore = calculateScore(engines);
    const visibilityGrade = gradeFromScore(overallScore);
    const topCompetitors = extractTopCompetitors(engines);
    const recommendations = generateRecommendations(engines, overallScore);

    const reportCard: ReportCard = {
      productName,
      query,
      overallScore,
      visibilityGrade,
      engines,
      topCompetitors,
      recommendations,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(reportCard);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
