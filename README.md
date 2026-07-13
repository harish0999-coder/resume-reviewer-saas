# ResumeScore AI

An AI-powered resume-to-job-description match scorer, built as a complete, real SaaS product for the
**"Zero to Subscriber" — Full-Stack SaaS in a Day** hackathon track.

A stranger can land on the page, sign up, subscribe with a Stripe test-mode card, and start scoring
resumes — no human intervention required.

## What's implemented (mapped to the brief)

| Requirement | Where |
|---|---|
| Marketing page, 2 pricing tiers, links to real signup | `app/page.tsx` |
| Real signup/login, persistent sessions | `app/(auth)/*`, `lib/auth.ts` (NextAuth, JWT sessions), `middleware.ts` |
| Real core feature (AI resume scoring on real input, real saved result) | `app/dashboard/review/page.tsx`, `app/api/review/route.ts`, `lib/ai.ts` |
| Per-user persistence | MongoDB via Prisma (`prisma/schema.prisma`) |
| Stripe Checkout, webhook-confirmed upgrade | `app/api/stripe/checkout`, `app/api/stripe/webhook` |
| Plan gating (free tier capped) | `FREE_DAILY_LIMIT` check in `app/api/review/route.ts` |
| Billing page, view plan, cancel | `app/dashboard/billing/page.tsx`, `app/api/stripe/portal` |
| Deployment | Vercel (see below) |

## Core feature notes

The resume scorer calls the Anthropic API when `ANTHROPIC_API_KEY` is set. If it's not set (e.g. you
don't have a key handy during setup), it automatically falls back to a deterministic local heuristic
scorer (keyword/skill overlap + resume-quality signals) — so the product is fully functional end-to-end
either way. This is a genuine engineering decision worth mentioning in your demo: the feature never
silently breaks just because a third-party key is missing.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

### Database (MongoDB)
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Database Access → add a user with a password.
3. Network Access → Add IP → "Allow access from anywhere" (0.0.0.0/0) — fine for a hackathon demo.
4. Copy the connection string into `DATABASE_URL` in `.env`, and make sure it includes a database
   name, e.g. `.../resume_reviewer?retryWrites=true&w=majority`.
5. Push the schema (MongoDB has no migrations, just schema sync):
   ```bash
   npx prisma db push
   ```

### Auth
```bash
openssl rand -base64 32   # paste into NEXTAUTH_SECRET
```

### AI (optional)
Set `ANTHROPIC_API_KEY` if you have one. Otherwise leave it blank — the app still works (see above).

### Stripe (test mode)
1. Create a free account at [stripe.com](https://stripe.com), stay in **test mode**.
2. Developers → API keys → copy the secret key into `STRIPE_SECRET_KEY`.
3. Product catalog → create a product "Pro Plan" with a **recurring monthly price** (e.g. $9.00) →
   copy the price ID (`price_...`) into `STRIPE_PRO_PRICE_ID`.
4. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

### Run it
```bash
npm run dev
```
Visit `http://localhost:3000`.

## 2. Test the full flow end-to-end

1. Sign up with a real-looking email/password.
2. Go to **Dashboard → New review**, paste any job description and resume text → get a scored report.
3. Run it 3 times (free-tier limit) → 4th attempt is blocked with an upgrade prompt.
4. Go to **Billing → Upgrade to Pro**, complete Stripe Checkout with test card
   `4242 4242 4242 4242`, any future expiry, any CVC.
5. You're redirected back with the account upgraded to Pro (confirmed via the webhook, not just the
   redirect — refresh and the plan is genuinely persisted in the database).
6. Run more than 3 reviews — no longer blocked.
7. Go to **Billing → Manage/cancel** to open the real Stripe customer portal and cancel — the webhook
   downgrades your account back to Free.

## 3. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

1. In the Vercel dashboard, add all variables from `.env` as Environment Variables
   (set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL once you have it).
2. In Stripe Dashboard → Developers → Webhooks → **Add endpoint**:
   `https://your-app.vercel.app/api/stripe/webhook`, select events
   `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` on Vercel.
3. Redeploy so the new env vars take effect.
4. Make sure MongoDB Atlas Network Access allows Vercel's outbound IPs (0.0.0.0/0 is simplest for a demo).

## Tech stack

- **Frontend/Backend:** Next.js 14 (App Router), React, Tailwind CSS
- **Auth:** NextAuth (Credentials provider, JWT sessions — persist across reloads)
- **Database:** MongoDB via Prisma
- **AI:** Anthropic API with a deterministic local fallback
- **Payments:** Stripe Checkout + Billing Portal + webhooks (test mode)
- **Deployment:** Vercel

## Project structure

```
app/
  page.tsx                     # Landing page (hero, features, pricing)
  (auth)/login, signup         # Auth pages
  dashboard/                   # Protected routes (middleware.ts guards these)
    page.tsx                   # Overview: plan, usage
    review/page.tsx            # Core feature: resume scoring form
    history/page.tsx           # Per-user saved reviews
    billing/page.tsx           # Plan + upgrade/cancel
  api/
    auth/signup, [...nextauth] # Auth endpoints
    review/                    # Scoring endpoint (plan-gated)
    me/                        # Current user info
    stripe/checkout, portal, webhook
lib/
  auth.ts, prisma.ts, stripe.ts, ai.ts
components/
  Navbar.tsx, Providers.tsx, ReviewResultCard.tsx
prisma/schema.prisma           # User, Review models (MongoDB)
```

## Known limitations (for the demo write-up)

- Credentials-based auth (no OAuth) — deliberate scope choice to keep signup frictionless for a
  stranger landing on the page with no third-party app setup.
- Single paid tier (Pro) — brief requires 2 tiers with different gates, which is satisfied by
  Free (3/day) vs Pro (unlimited); a third tier could be added the same way if needed.
- AI fallback scorer is heuristic, not LLM-based, when no API key is present — documented as an
  intentional resilience choice, not a bug.
