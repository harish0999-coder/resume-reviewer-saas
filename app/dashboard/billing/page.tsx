@'
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Me {
  plan: "FREE" | "PRO";
  subscriptionStatus: string | null;
}

function CheckoutBanner() {
  const searchParams = useSearchParams();
  const checkoutState = searchParams.get("checkout");

  if (checkoutState === "success") {
    return (
      <div className="mb-6 text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-3">
        Payment received — your account has been upgraded to Pro.
      </div>
    );
  }
  if (checkoutState === "cancelled") {
    return (
      <div className="mb-6 text-white/60 text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3">
        Checkout was cancelled. No changes were made.
      </div>
    );
  }
  return null;
}

export default function BillingPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => {});
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  async function handleManage() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  const isPro = me?.plan === "PRO";

  return (
    <main>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1">Billing</h1>
        <p className="text-white/50 text-sm mb-8">Manage your plan and payment method.</p>

        <Suspense fallback={null}>
          <CheckoutBanner />
        </Suspense>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide">Current plan</p>
              <p className="text-2xl font-bold mt-1">{me?.plan ?? "..."}</p>
              {me?.subscriptionStatus && (
                <p className="text-white/40 text-xs mt-1">Status: {me.subscriptionStatus}</p>
              )}
            </div>
            {isPro ? (
              <button onClick={handleManage} disabled={loading} className="btn-secondary">
                {loading ? "Loading..." : "Manage / cancel"}
              </button>
            ) : (
              <button onClick={handleUpgrade} disabled={loading} className="btn-primary">
                {loading ? "Loading..." : "Upgrade to Pro — $9/mo"}
              </button>
            )}
          </div>
        </div>

        <p className="text-white/30 text-xs mt-6">
          Payments are processed by Stripe in test mode. Use card number 4242 4242 4242 4242, any future
          expiry, any CVC, to simulate a successful payment.
        </p>
      </div>
    </main>
  );
}
'@ | Out-File -FilePath app\dashboard\billing\page.tsx -Encoding utf8
