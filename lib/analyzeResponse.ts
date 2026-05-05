import { AIEngine, EngineResponse } from "./types";

const POSITIVE_WORDS = ["best", "top", "recommended", "excellent", "great", "leading", "popular", "strong choice", "good", "amazing", "outstanding", "superior"];
const NEGATIVE_WORDS = ["avoid", "poor", "worst", "inferior", "not recommended", "limited", "weak", "disappointing", "bad"];

function buildSentenceWindows(response: string) {
  return response
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractKeywords(productName: string): string[] {
  return productName
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function findProductInResponse(response: string, productName: string, keywords: string[]): { mentioned: boolean; snippet: string; sentenceIndex: number } {
  const responseLower = response.toLowerCase();
  const productLower = productName.toLowerCase();
  
  // Exact match
  if (responseLower.includes(productLower)) {
    const sentences = buildSentenceWindows(response);
    const sentenceIndex = sentences.findIndex(s => s.toLowerCase().includes(productLower));
    return {
      mentioned: true,
      snippet: sentences[sentenceIndex] ?? "",
      sentenceIndex: sentenceIndex >= 0 ? sentenceIndex + 1 : 0
    };
  }
  
  // Check for keywords (at least 2 keywords should match)
  const matchedKeywords = keywords.filter(keyword => responseLower.includes(keyword));
  if (matchedKeywords.length >= Math.max(2, Math.ceil(keywords.length * 0.6))) {
    const sentences = buildSentenceWindows(response);
    const sentenceIndex = sentences.findIndex(s => 
      matchedKeywords.some(keyword => s.toLowerCase().includes(keyword))
    );
    return {
      mentioned: true,
      snippet: sentences[sentenceIndex] ?? "",
      sentenceIndex: sentenceIndex >= 0 ? sentenceIndex + 1 : 0
    };
  }
  
  return { mentioned: false, snippet: "", sentenceIndex: 0 };
}

export function analyzeResponse(
  engine: AIEngine,
  rawResponse: string,
  productName: string,
  competitors: string[]
): EngineResponse {
  const responseLower = rawResponse.toLowerCase();
  const keywords = extractKeywords(productName);
  
  const { mentioned, snippet, sentenceIndex } = findProductInResponse(rawResponse, productName, keywords);
  const rank = mentioned && sentenceIndex > 0 ? sentenceIndex : (mentioned ? 1 : null);

  let sentiment: EngineResponse["sentiment"] = "not_mentioned";
  
  if (mentioned && snippet) {
    const context = snippet.toLowerCase();
    if (NEGATIVE_WORDS.some((word) => context.includes(word))) {
      sentiment = "negative";
    } else if (POSITIVE_WORDS.some((word) => context.includes(word))) {
      sentiment = "positive";
    } else {
      sentiment = "neutral";
    }
  } else if (!mentioned) {
    // Analyze overall sentiment in the response for recommendations
    const positiveCount = POSITIVE_WORDS.filter(word => responseLower.includes(word)).length;
    const negativeCount = NEGATIVE_WORDS.filter(word => responseLower.includes(word)).length;
    
    if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = "negative";
    } else if (positiveCount > 0) {
      sentiment = "positive";
    } else {
      sentiment = "neutral";
    }
  }

  const mentionedCompetitors = competitors.filter((competitor) =>
    responseLower.includes(competitor.toLowerCase())
  );

  return {
    engine,
    rawResponse,
    mentioned,
    rank,
    sentiment,
    mentionedCompetitors,
    snippet
  };
}
