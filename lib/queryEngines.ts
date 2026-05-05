import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const NEMOTRON_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const GEMMA_MODEL = "google/gemma-3n-e2b-it:free";
const GPT_OSS_MODEL = "openai/gpt-oss-120b:free";

const SYSTEM_PROMPT =
  "You are a helpful product recommendation assistant. Answer the user's query with specific product recommendations. Be comprehensive, rank products if possible, and keep responses under 300 words.";

function requireKey(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

async function queryOpenRouterModel(model: string, label: string, query: string): Promise<string> {
  console.log(`Querying ${label} via OpenRouter...`);
  const apiKey = requireKey(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY");

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "AEO Diagnostic Tool"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: false
    })
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`${label} request failed: ${response.status} ${response.statusText}${responseText ? ` - ${responseText}` : ""}`);
  }

  const data = JSON.parse(responseText) as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;
  const text = typeof content === "string"
    ? content
    : Array.isArray(content)
      ? content
          .map((part) => (part.type === "text" ? part.text ?? "" : ""))
          .join("")
      : "";

  console.log(`${label} Response received, length:`, text.length);
  return text;
}

export async function queryGPT(query: string): Promise<string> {
  console.log("Querying Nemotron via OpenRouter SDK with streaming...");
  const openrouter = new OpenRouter({
    apiKey: requireKey(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY")
  });

  const stream = await (openrouter.chat as any).send({
    chatRequest: {
      model: NEMOTRON_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true
    }
  });

  let content = "";
  for await (const chunk of stream) {
    const chunkContent = chunk.choices[0]?.delta?.content;
    if (chunkContent) {
      content += chunkContent;
    }
  }

  console.log("Nemotron Response received, length:", content.length);
  return content;
}

export async function queryClaude(query: string): Promise<string> {
  console.log("Querying Gemma 3n 2B via OpenRouter SDK with streaming...");
  const openrouter = new OpenRouter({
    apiKey: requireKey(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY")
  });

  const stream = await (openrouter.chat as any).send({
    chatRequest: {
      model: GEMMA_MODEL,
      messages: [
        { role: "user", content: query }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true
    }
  });

  let content = "";
  for await (const chunk of stream) {
    const chunkContent = chunk.choices[0]?.delta?.content;
    if (chunkContent) {
      content += chunkContent;
    }
  }

  console.log("Gemma Response received, length:", content.length);
  return content;
}

export async function queryGemini(query: string): Promise<string> {
  console.log("Querying GPT-OSS-120B via OpenRouter SDK with streaming...");
  const openrouter = new OpenRouter({
    apiKey: requireKey(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY")
  });

  const stream = await (openrouter.chat as any).send({
    chatRequest: {
      model: GPT_OSS_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true
    }
  });

  let content = "";
  for await (const chunk of stream) {
    const chunkContent = chunk.choices[0]?.delta?.content;
    if (chunkContent) {
      content += chunkContent;
    }
  }

  console.log("GPT-OSS-120B Response received, length:", content.length);
  return content;
}

export async function queryAllEngines(query: string) {
  console.log("Querying all models for:", query);
  const [gpt, claude, gemini] = await Promise.allSettled([
    queryGPT(query),
    queryClaude(query),
    queryGemini(query)
  ]);

  if (gpt.status === "rejected") console.error("Nvidia Nemotron failed:", gpt.reason);
  if (claude.status === "rejected") console.error("Gemma 3n 2B failed:", claude.reason);
  if (gemini.status === "rejected") console.error("GPT-OSS-120B failed:", gemini.reason);

  return {
    gpt: gpt.status === "fulfilled" ? gpt.value : "Error fetching response",
    claude: claude.status === "fulfilled" ? claude.value : "Error fetching response",
    gemini: gemini.status === "fulfilled" ? gemini.value : "Error fetching response"
  };
}
