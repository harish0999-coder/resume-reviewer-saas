"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/50 text-sm mb-8">Log in to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-white/50 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
