interface Props {
  score: number;
  grade: string;
}

export default function ScoreBadge({ score, grade }: Props) {
  const color =
    grade === "A"
      ? "text-emerald-300 border-emerald-300/80"
      : grade === "B"
        ? "text-sky-300 border-sky-300/80"
        : grade === "C"
          ? "text-amber-300 border-amber-300/80"
          : grade === "D"
            ? "text-orange-300 border-orange-300/80"
            : "text-rose-300 border-rose-300/80";

  return (
    <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${color} bg-white/5 shadow-glow`}>
      <span className="text-3xl font-black leading-none">{grade}</span>
      <span className="font-mono text-[11px] text-white/60">{score}/100</span>
    </div>
  );
}
