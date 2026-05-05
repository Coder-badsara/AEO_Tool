import { CalendarDays, Target } from "lucide-react";
import { ReportCard as ReportCardType } from "@/lib/types";
import CompetitorChart from "./CompetitorChart";
import EngineResult from "./EngineResult";
import ScoreBadge from "./ScoreBadge";

interface Props {
  report: ReportCardType;
}

export default function ReportCard({ report }: Props) {
  return (
    <section className="mt-10 space-y-8">
      <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-glow backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/55">
            <Target className="h-3.5 w-3.5 text-emerald-300" />
            Diagnostic report
          </div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{report.productName}</h2>
          <p className="max-w-3xl text-white/70">“{report.query}”</p>
          <p className="flex items-center gap-2 text-sm text-white/45">
            <CalendarDays className="h-4 w-4" />
            Tested {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>

        <ScoreBadge score={report.overallScore} grade={report.visibilityGrade} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {report.engines.map((engine) => (
          <EngineResult key={engine.engine} result={engine} />
        ))}
      </div>

      {report.topCompetitors.length > 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm md:p-8">
          <h3 className="text-lg font-semibold text-white">Competitor Mentions Across AI Engines</h3>
          <p className="mt-1 text-sm text-white/50">Higher bars indicate more engines mentioning the competitor.</p>
          <div className="mt-6">
            <CompetitorChart competitors={report.topCompetitors} productName={report.productName} productScore={report.overallScore} />
          </div>
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm md:p-8">
        <h3 className="text-lg font-semibold text-white">Recommendations</h3>
        <ul className="mt-4 space-y-3">
          {report.recommendations.map((recommendation, index) => (
            <li key={recommendation} className="flex gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-white/75">
              <span className="font-mono text-sm text-emerald-300">{index + 1}.</span>
              <span className="text-sm leading-6">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
