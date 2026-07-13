import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { FREE_DAILY_LIMIT } from "@/lib/stripe";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const usedToday = await prisma.review.count({ where: { userId, createdAt: { gte: since } } });
  const totalReviews = await prisma.review.count({ where: { userId } });

  const isPro = user?.plan === "PRO";

  return (
    <main>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="text-white/50 mt-1">
          You're on the{" "}
          <span className={isPro ? "text-brand-400 font-medium" : "font-medium"}>{user?.plan}</span> plan.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="card p-5">
            <p className="text-white/50 text-xs uppercase tracking-wide">Reviews today</p>
            <p className="text-2xl font-bold mt-1">
              {usedToday}
              {!isPro && <span className="text-white/40 text-base font-normal"> / {FREE_DAILY_LIMIT}</span>}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-white/50 text-xs uppercase tracking-wide">Total reviews</p>
            <p className="text-2xl font-bold mt-1">{totalReviews}</p>
          </div>
          <div className="card p-5">
            <p className="text-white/50 text-xs uppercase tracking-wide">Plan</p>
            <p className="text-2xl font-bold mt-1">{user?.plan}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/dashboard/review" className="btn-primary">
            New resume review
          </Link>
          <Link href="/dashboard/history" className="btn-secondary">
            View history
          </Link>
          {!isPro && (
            <Link href="/dashboard/billing" className="btn-secondary">
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
