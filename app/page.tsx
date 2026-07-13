import Link from "next/link";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    title: "Instant match scoring",
    desc: "Paste a resume and a job description, get a 0-100 match score in seconds.",
  },
  {
    title: "Keyword gap analysis",
    desc: "See exactly which skills and terms from the JD are missing from your resume.",
  },
  {
    title: "Actionable rewrites",
    desc: "Get specific, bullet-level suggestions — not generic \"add more keywords\" advice.",
  },
  {
    title: "Review history",
    desc: "Every review is saved to your account so you can track improvement over time.",
  },
];

export default function LandingPage() {
  return (
    <main>
      <Navbar />

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <div className="inline-block mb-5 text-xs font-medium tracking-wide uppercase text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
          AI-powered resume matching
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Get your resume past the <span className="text-brand-400">ATS</span> — and the recruiter.
        </h1>
        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
          Paste your resume and a job description. In seconds, get a real match score, the exact gaps
          hurting you, and specific fixes — powered by AI, saved to your account.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Review my resume free
          </Link>
          <a href="#pricing" className="btn-secondary">
            See pricing
          </a>
        </div>
        <p className="mt-4 text-sm text-white/40">No credit card required for the free plan.</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-white/60 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <p className="text-white/60 mt-2">Start free. Upgrade when you're applying at scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Starter / Free */}
          <div className="card p-8 flex flex-col">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="text-white/50 text-sm mt-1">For occasional applications</p>
            <div className="mt-6 text-4xl font-bold">
              $0<span className="text-base font-normal text-white/50">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-white/70 flex-1">
              <li>✓ 3 resume reviews / day</li>
              <li>✓ Match score + keyword gaps</li>
              <li>✓ Review history</li>
              <li className="text-white/30">✗ Unlimited reviews</li>
            </ul>
            <Link href="/signup" className="btn-secondary mt-8 text-center">
              Start free
            </Link>
          </div>

          {/* Pro */}
          <div className="card p-8 flex flex-col border-brand-500/50 relative">
            <div className="absolute -top-3 right-6 bg-brand-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              Most popular
            </div>
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-white/50 text-sm mt-1">For active job seekers</p>
            <div className="mt-6 text-4xl font-bold">
              $9<span className="text-base font-normal text-white/50">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-white/70 flex-1">
              <li>✓ Unlimited resume reviews</li>
              <li>✓ Match score + keyword gaps</li>
              <li>✓ Review history</li>
              <li>✓ Priority AI model</li>
            </ul>
            <Link href="/signup" className="btn-primary mt-8 text-center">
              Get Pro
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-white/30 text-sm py-10">
        Built for the "Zero to Subscriber" hackathon track.
      </footer>
    </main>
  );
}
