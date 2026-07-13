"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign-in right after signup for a frictionless flow.
    const signInRes = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (signInRes?.ok) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-white/50 text-sm mb-8">Start reviewing resumes in under a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Password (min 8 characters)"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-white/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
