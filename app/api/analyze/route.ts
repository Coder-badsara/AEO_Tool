import { NextRequest, NextResponse } from "next/server";
import { analyzeResponse } from "@/lib/analyzeResponse";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      engine?: "gpt" | "claude" | "gemini";
      rawResponse?: string;
      productName?: string;
      competitors?: string[];
    };

    const { engine, rawResponse, productName, competitors = [] } = body;

    if (!engine || !rawResponse || !productName) {
      return NextResponse.json({ error: "engine, rawResponse, and productName are required" }, { status: 400 });
    }

    const analyzed = analyzeResponse(engine, rawResponse, productName, competitors);
    return NextResponse.json(analyzed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
