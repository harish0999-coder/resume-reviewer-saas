import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;

  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1">Review history</h1>
        <p className="text-white/50 text-sm mb-8">Every review you've run, saved to your account.</p>

        {reviews.length === 0 && (
          <p className="text-white/40 text-sm">No reviews yet. Run your first one from the dashboard.</p>
        )}

        <div className="space-y-4">
          {reviews.map((r: (typeof reviews)[number]) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.jobTitle || "Untitled role"}</p>
                  <p className="text-white/40 text-xs mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className={`text-2xl font-bold ${scoreColor(r.score)}`}>{r.score}</div>
              </div>
              <p className="text-white/60 text-sm mt-3">{r.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
