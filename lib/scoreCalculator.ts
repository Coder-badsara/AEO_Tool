import { CompetitorStat, EngineResponse, ReportCard } from "./types";

const MAX_PER_ENGINE = 53;

const ENGINE_LABELS: Record<string, string> = {
  gpt: "Nvidia Nemotron",
  claude: "Gemma 3n 2B",
  gemini: "GPT-OSS-120B"
};

export function calculateScore(engines: EngineResponse[]): number {
  const totalRaw = engines.reduce((sum, engine) => {
    if (!engine.mentioned) {
      return sum;
    }

    let engineScore = 20;

    if (engine.rank === 1) {
      engineScore += 20;
    } else if (engine.rank === 2) {
      engineScore += 12;
    } else if (engine.rank === 3) {
      engineScore += 6;
    }

    if (engine.sentiment === "positive") {
      engineScore += 13;
    } else if (engine.sentiment === "neutral") {
      engineScore += 5;
    }

    return sum + engineScore;
  }, 0);

  const normalized = (totalRaw / (MAX_PER_ENGINE * Math.max(engines.length, 1))) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

export function gradeFromScore(score: number): ReportCard["visibilityGrade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}

export function extractTopCompetitors(engines: EngineResponse[]): CompetitorStat[] {
  const competitorMap = new Map<string, Set<string>>();

  engines.forEach((engine) => {
    engine.mentionedCompetitors.forEach((competitor) => {
      const existing = competitorMap.get(competitor) ?? new Set<string>();
      existing.add(engine.engine);
      competitorMap.set(competitor, existing);
    });
  });

  return Array.from(competitorMap.entries())
    .map(([name, engineSet]) => ({
      name,
      mentionCount: engineSet.size,
      engines: Array.from(engineSet) as CompetitorStat["engines"]
    }))
    .sort((left, right) => right.mentionCount - left.mentionCount)
    .slice(0, 8);
}

export function generateRecommendations(engines: EngineResponse[], score: number): string[] {
  const recommendations: string[] = [];
  const notMentioned = engines.filter((engine) => !engine.mentioned).map((engine) => ENGINE_LABELS[engine.engine]);
  const negativeSentiment = engines.filter((engine) => engine.sentiment === "negative").map((engine) => ENGINE_LABELS[engine.engine]);
  const lowRank = engines.filter((engine) => engine.rank !== null && engine.rank > 3).map((engine) => ENGINE_LABELS[engine.engine]);

  if (notMentioned.length > 0) {
    recommendations.push(
      `Your product is not mentioned by ${notMentioned.join(", ")}. Publish authoritative content and get cited by high-domain-authority sites.`
    );
  }

  if (negativeSentiment.length > 0) {
    recommendations.push(
      `Negative sentiment detected on ${negativeSentiment.join(", ")}. Review public reviews and address recurring objections.`
    );
  }

  if (lowRank.length > 0) {
    recommendations.push(
      `Low rank on ${lowRank.join(", ")}. Create comparison articles and FAQ content that positions you above competitors.`
    );
  }

  if (score < 50) {
    recommendations.push("Overall AEO score is low. Focus on building structured, question-answering content optimized for AI training corpora.");
  }

  if (score >= 85) {
    recommendations.push("Excellent AEO visibility. Maintain freshness by updating product pages and keeping reviews current.");
  }

  return recommendations.length > 0
    ? recommendations
    : ["Maintain consistency across all your product listings and keep your content regularly updated."];
}
