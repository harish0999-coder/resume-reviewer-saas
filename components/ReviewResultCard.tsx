export interface ReviewResultData {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export default function ReviewResultCard({ result }: { result: ReviewResultData }) {
  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Match report</h3>
        <div className={`text-3xl font-bold ${scoreColor(result.score)}`}>{result.score}/100</div>
      </div>
      <p className="text-white/70 text-sm mb-6">{result.summary}</p>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-2">Strengths</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            {result.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-2">Gaps</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            {result.gaps.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-brand-400 text-xs font-semibold uppercase tracking-wide mb-2">Suggestions</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            {result.suggestions.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
