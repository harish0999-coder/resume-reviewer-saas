import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreResume } from "@/lib/ai";
import { FREE_DAILY_LIMIT } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Plan gating: FREE tier capped at FREE_DAILY_LIMIT reviews per day.
  if (user.plan === "FREE") {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const usedToday = await prisma.review.count({
      where: { userId, createdAt: { gte: since } },
    });
    if (usedToday >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Free plan is limited to ${FREE_DAILY_LIMIT} reviews per day. Upgrade to Pro for unlimited reviews.`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }
  }

  const { resumeText, jobDescription, jobTitle } = await req.json();

  if (!resumeText || resumeText.trim().length < 50) {
    return NextResponse.json({ error: "Please paste a resume with at least 50 characters." }, { status: 400 });
  }
  if (!jobDescription || jobDescription.trim().length < 30) {
    return NextResponse.json({ error: "Please paste a job description with at least 30 characters." }, { status: 400 });
  }

  const result = await scoreResume(resumeText, jobDescription);

  const review = await prisma.review.create({
    data: {
      userId,
      jobTitle: jobTitle || null,
      jobDescription,
      resumeText,
      score: result.score,
      summary: result.summary,
      strengths: result.strengths,
      gaps: result.gaps,
      suggestions: result.suggestions,
    },
  });

  return NextResponse.json({ review });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ reviews });
}
