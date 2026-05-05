import { EngineResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

const ENGINE_LABELS: Record<EngineResponse["engine"], string> = {
  gpt: "Nvidia Nemotron",
  claude: "Gemma 3n 2B",
  gemini: "GPT-OSS-120B"
};

interface Props {
  result: EngineResponse;
}

export default function EngineResult({ result }: Props) {
  const { engine, mentioned, rank, sentiment, snippet, rawResponse } = result;
  const statusColor = mentioned
    ? sentiment === "positive"
      ? "text-emerald-300"
      : sentiment === "negative"
        ? "text-rose-300"
        : "text-amber-300"
    : "text-slate-400";

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{ENGINE_LABELS[engine]}</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Engine result</p>
        </div>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusColor)}>
          {mentioned ? (rank ? `#${rank}` : "Mentioned") : "Not found"}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-slate-950/50 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/35">Sentiment</p>
        <p className={cn("mt-1 text-sm font-medium capitalize", mentioned ? statusColor : "text-slate-400")}>
          {mentioned ? sentiment.replace("_", " ") : "Not mentioned"}
        </p>
      </div>

      {snippet ? (
        <p className="mt-4 border-l-2 border-emerald-300/40 pl-3 text-sm leading-6 text-white/70">
          “{snippet}”
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-white/45">Your product was not mentioned by this AI model in the search results.</p>
      )}

      <details className="mt-4 rounded-xl border border-white/8 bg-black/20 p-3">
        <summary className="cursor-pointer text-xs uppercase tracking-[0.25em] text-white/45">Raw output</summary>
        <p className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap text-sm leading-6 text-white/70">
          {rawResponse}
        </p>
      </details>
    </article>
  );
}
