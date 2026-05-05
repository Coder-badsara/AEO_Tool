import { NextRequest, NextResponse } from "next/server";
import { queryClaude } from "@/lib/queryEngines";

export async function POST(request: NextRequest) {
  try {
    const { query } = (await request.json()) as { query?: string };

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const response = await queryClaude(query);
    return NextResponse.json({ engine: "claude", response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
