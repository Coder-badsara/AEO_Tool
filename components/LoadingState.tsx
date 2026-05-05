const ENGINES = ["Nvidia Nemotron", "Gemma 3n 2B", "GPT-OSS-120B"];

export default function LoadingState() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-sm">
      <p className="text-center text-sm text-white/65">Querying AI engines in parallel...</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
        {ENGINES.map((engine) => (
          <div key={engine} className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-5 min-w-28">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">{engine}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
