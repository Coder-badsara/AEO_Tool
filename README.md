# AEO Diagnostic Tool

Next.js application that queries Nvidia Nemotron, Gemma 3n 2B, and GPT-OSS-120B in parallel, analyzes how they mention a product, and renders a report card with a visibility score, competitor comparison, and recommendations.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the API keys.
2. Install dependencies with `npm install`.
3. Run `npm run dev` for local development.
4. Build for production with `npm run build`.

## Environment Variables

- `OPENROUTER_API_KEY` (required for all three model calls)
- `NEXT_PUBLIC_APP_URL`

## API Routes

- `POST /api/diagnose` orchestrates the full workflow.
- `POST /api/query-gpt` returns only the Nvidia Nemotron response.
- `POST /api/query-claude` returns only the Gemma 3n 2B response.
- `POST /api/query-gemini` returns only the GPT-OSS-120B response.
- `POST /api/analyze` parses a raw engine response.

## Update Map

- `app/page.tsx` controls the landing page and submit flow.
- `components/DiagnosticForm.tsx` owns the input fields and form submission.
- `components/ReportCard.tsx` renders the final report.
- `components/EngineResult.tsx` renders one engine's analysis.
- `components/CompetitorChart.tsx` renders competitor bars.
- `components/ScoreBadge.tsx` renders the grade and score badge.
- `components/LoadingState.tsx` renders the loading animation.
- `lib/types.ts` is the source of truth for shared data shapes.
- `lib/queryEngines.ts` contains the server-side SDK calls.
- `lib/analyzeResponse.ts` contains the parsing logic.
- `lib/scoreCalculator.ts` contains score, grade, and recommendation logic.
- `app/api/diagnose/route.ts` is the main orchestration endpoint.
- `app/api/query-gpt/route.ts` updates GPT-specific request handling.
- `app/api/query-claude/route.ts` updates Claude-specific request handling.
- `app/api/query-gemini/route.ts` updates Gemini-specific request handling.
- `app/api/analyze/route.ts` updates raw-response analysis.
- `app/layout.tsx` controls metadata and fonts.
- `app/globals.css` controls the global visual system.
