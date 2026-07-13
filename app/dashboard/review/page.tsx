"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ReviewResultCard, { ReviewResultData } from "@/components/ReviewResultCard";

export default function ReviewPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [result, setResult] = useState<ReviewResultData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUpgradeRequired(false);
    setResult(null);
    setLoading(true);

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, jobDescription, resumeText }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      if (data.upgradeRequired) setUpgradeRequired(true);
      return;
    }

    setResult(data.review);
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1">Review a resume</h1>
        <p className="text-white/50 text-sm mb-8">
          Paste the job description and your resume text. We'll score the match and tell you exactly what to fix.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Job title (optional, e.g. Software Engineer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <textarea
            className="input min-h-[140px]"
            placeholder="Paste the job description here..."
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <textarea
            className="input min-h-[220px]"
            placeholder="Paste your resume text here..."
            required
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          {error && (
            <div className="text-red-400 text-sm">
              {error}
              {upgradeRequired && (
                <a href="/dashboard/billing" className="text-brand-400 hover:underline ml-2">
                  Upgrade now →
                </a>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Scoring resume..." : "Score my resume"}
          </button>
        </form>

        {result && <ReviewResultCard result={result} />}
      </div>
    </main>
  );
}
