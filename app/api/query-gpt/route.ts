import { NextRequest, NextResponse } from "next/server";
import { queryGPT } from "@/lib/queryEngines";

export async function POST(request: NextRequest) {
  try {
    const { query } = (await request.json()) as { query?: string };

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const response = await queryGPT(query);
    return NextResponse.json({ engine: "gpt", response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
