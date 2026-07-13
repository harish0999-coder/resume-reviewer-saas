export interface ReviewResult {
  score: number; // 0-100
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

const SYSTEM_PROMPT = `You are an expert technical recruiter and ATS specialist. You will be given a candidate's resume text and a target job description. Score how well the resume matches the job on a 0-100 scale, accounting for keyword/skill overlap, relevant experience, and ATS-friendliness.

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<short bullet>", "..."],
  "gaps": ["<short bullet>", "..."],
  "suggestions": ["<short, actionable bullet>", "..."]
}
Keep each array to 3-5 items. Keep bullets concise (under 20 words each).`;

/**
 * Scores a resume against a job description.
 * Uses the Anthropic API when ANTHROPIC_API_KEY is configured; otherwise
 * falls back to a deterministic local heuristic so the product remains
 * fully functional (real, saved, per-user results) without external keys.
 */
export async function scoreResume(resumeText: string, jobDescription: string): Promise<ReviewResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.find((b: any) => b.type === "text")?.text ?? "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return normalizeResult(parsed);
      }
      console.error("Anthropic API error", res.status, await res.text());
    } catch (err) {
      console.error("Anthropic scoring failed, falling back to heuristic:", err);
    }
  }

  return heuristicScore(resumeText, jobDescription);
}

function normalizeResult(raw: any): ReviewResult {
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(raw.score) || 0))),
    summary: String(raw.summary || "").slice(0, 600),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.slice(0, 5).map(String) : [],
    gaps: Array.isArray(raw.gaps) ? raw.gaps.slice(0, 5).map(String) : [],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions.slice(0, 5).map(String) : [],
  };
}

/**
 * Deterministic, dependency-free scorer: keyword/skill overlap between the
 * job description and resume, plus simple resume-quality signals. This is
 * intentionally simple but genuinely computes a real result from real input.
 */
function heuristicScore(resumeText: string, jobDescription: string): ReviewResult {
  const tokenize = (s: string) =>
    Array.from(
      new Set(
        s
          .toLowerCase()
          .replace(/[^a-z0-9+.# ]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
      )
    );

  const jdTokens = tokenize(jobDescription);
  const resumeTokens = new Set(tokenize(resumeText));

  const matched = jdTokens.filter((t) => resumeTokens.has(t));
  const missing = jdTokens.filter((t) => !resumeTokens.has(t));

  const overlapRatio = jdTokens.length ? matched.length / jdTokens.length : 0;

  // Quality signals
  const hasNumbers = /\d/.test(resumeText);
  const hasActionVerbs = /\b(built|led|designed|implemented|shipped|optimized|reduced|increased|architected|deployed)\b/i.test(
    resumeText
  );
  const lengthScore = resumeText.length > 400 && resumeText.length < 8000 ? 1 : 0.6;

  let score = overlapRatio * 70; // up to 70 points from keyword match
  if (hasNumbers) score += 10;
  if (hasActionVerbs) score += 10;
  score += lengthScore * 10;
  score = Math.round(Math.max(5, Math.min(97, score)));

  const topMatched = matched.slice(0, 5);
  const topMissing = missing.slice(0, 5);

  return {
    score,
    summary: `Matched ${matched.length} of ${jdTokens.length} key terms from the job description (${Math.round(
      overlapRatio * 100
    )}% overlap). ${hasActionVerbs ? "Resume uses strong action verbs." : "Consider adding more action-oriented, quantified bullet points."}`,
    strengths: topMatched.length
      ? topMatched.map((k) => `Resume already covers "${k}", which appears in the job description.`)
      : ["Resume was received and parsed successfully."],
    gaps: topMissing.length
      ? topMissing.map((k) => `Job description mentions "${k}", which was not clearly found in the resume.`)
      : ["No major keyword gaps detected."],
    suggestions: [
      !hasNumbers ? "Add quantified impact (%, $, time saved) to at least 2-3 bullets." : "Keep quantifying impact where possible.",
      !hasActionVerbs ? "Start bullets with strong action verbs (built, led, shipped, optimized)." : "Strong verb usage — keep it consistent throughout.",
      topMissing.length ? `Work in relevant missing terms naturally, e.g. "${topMissing[0]}".` : "Keyword coverage looks solid for this role.",
    ],
  };
}

const STOP_WORDS = new Set([
  "the","and","for","with","that","this","from","will","have","are","you","your","our","their",
  "job","role","team","work","years","experience","strong","ability","must","should","able",
  "including","etc","using","use","across","within","also","other","such","who","what","how",
]);
