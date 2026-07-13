"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 max-w-6xl mx-auto">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Resume<span className="text-brand-400">Score</span> AI
      </Link>
      <div className="flex items-center gap-3">
        {status === "authenticated" ? (
          <>
            <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/billing" className="text-sm text-white/80 hover:text-white">
              Billing
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary text-sm">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-white/80 hover:text-white">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
