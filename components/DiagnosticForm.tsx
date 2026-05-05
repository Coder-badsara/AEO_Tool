"use client";

import { useState } from "react";
import { Search, Sparkles, TriangleAlert } from "lucide-react";

interface Props {
  onSubmit: (productName: string, query: string, competitors: string[]) => void;
  loading: boolean;
}

export default function DiagnosticForm({ onSubmit, loading }: Props) {
  const [productName, setProductName] = useState("");
  const [query, setQuery] = useState("");
  const [competitorInput, setCompetitorInput] = useState("");

  function handleSubmit() {
    if (!productName.trim() || !query.trim() || loading) {
      return;
    }

    const competitors = competitorInput
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    onSubmit(productName.trim(), query.trim(), competitors);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-glow backdrop-blur-sm md:p-8">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-white/85">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            Your Product Name
          </span>
          <input
            type="text"
            placeholder="e.g. MagneMind Pro"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/20"
          />
        </label>

        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-white/85">
            <Search className="h-4 w-4 text-amber-300" />
            Search Query to Test
          </span>
          <input
            type="text"
            placeholder="e.g. best magnesium supplement for seniors"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/20"
          />
        </label>

        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-white/85">
            <TriangleAlert className="h-4 w-4 text-sky-300" />
            Known Competitors <span className="text-white/40">(comma-separated, optional)</span>
          </span>
          <input
            type="text"
            placeholder="e.g. Natural Vitality, Doctor's Best, NOW Foods"
            value={competitorInput}
            onChange={(event) => setCompetitorInput(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/20"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading || !productName.trim() || !query.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Querying AI engines..." : "Run AEO Diagnosis"}
        </button>
      </div>
    </section>
  );
}
