"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import DiagnosticForm from "@/components/DiagnosticForm";
import LoadingState from "@/components/LoadingState";
import ReportCard from "@/components/ReportCard";
import { ReportCard as ReportCardType } from "@/lib/types";

export default function Home() {
  const [report, setReport] = useState<ReportCardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDiagnose(productName: string, query: string, competitors: string[]) {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, query, competitors })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Diagnosis failed");
      }

      setReport(data as ReportCardType);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Diagnosis failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <header className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/55">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            AEO diagnostic tool
          </div>
          <h1 className="bg-gradient-to-b from-white via-white to-white/65 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-6xl">
            See how AI engines rank your product.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Query Nvidia Nemotron, Gemma 3n 2B, and GPT-OSS-120B in parallel, compare competitor mentions, and generate a report card that shows where your product is visible or missing.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Parallel AI queries
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2">
              <Trophy className="h-4 w-4 text-amber-300" />
              Visibility score and grade
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2">
              <ArrowRight className="h-4 w-4 text-sky-300" />
              Deployment-ready Next.js app
            </span>
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-4xl">
          <DiagnosticForm onSubmit={handleDiagnose} loading={loading} />

          {loading ? <LoadingState /> : null}
          {error ? <p className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-center text-sm text-rose-200">{error}</p> : null}
          {report ? <ReportCard report={report} /> : null}
        </div>
      </div>
    </main>
  );
}
