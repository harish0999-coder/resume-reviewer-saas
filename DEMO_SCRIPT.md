# Demo Video Script — ResumeScore AI (~3 minutes)

## 0:00–0:20 — Hook + what it is
"This is ResumeScore AI — a real SaaS product, not a demo. A stranger can land here, sign up,
subscribe with a real Stripe flow, and start using it — no intervention from me."
[Show landing page, scroll through hero → features → pricing]

## 0:20–0:50 — Landing page & pricing
"Two tiers: Starter is free, capped at 3 reviews a day. Pro is $9/month, unlimited. Both link
straight into the real signup flow — nothing here is a static mockup."
[Click "Get started" from the pricing card, not a separate button]

## 0:50–1:20 — Signup & persistent auth
"Real signup, hashed password, session persists — I'll reload the page to prove it."
[Sign up → land on dashboard → hard refresh → still logged in]

## 1:20–2:00 — The core feature
"The actual product: paste a job description and a resume, get a real AI-scored match report —
score, strengths, gaps, and specific suggestions. This is a live AI call, not canned text, and
it's saved per-user in MongoDB — I'll check history after."
[Paste a real JD + resume → submit → show the scored report → go to History, show it's there]

## 2:00–2:30 — Plan gating hits a real limit
"Free tier is capped at 3 reviews a day — I've already used mine, so a 4th attempt is blocked
with an upgrade prompt, enforced server-side, not just hidden in the UI."
[Attempt a 4th review → show the block → click "Upgrade now"]

## 2:30–3:00 — Real Stripe checkout + webhook-confirmed upgrade
"This goes to real Stripe Checkout in test mode." [Enter 4242 4242 4242 4242] "On success, I'm
redirected back — and critically, the plan upgrade came from Stripe's webhook hitting my backend,
not just the redirect URL. I'll prove it by refreshing and running a 4th review, which now works."
[Complete checkout → back on billing page shows Pro → run another review successfully →
optionally show "Manage/cancel" opening the real Stripe customer portal]

## Closing line
"Repo, live URL, and setup instructions are in the README — thanks for watching."
