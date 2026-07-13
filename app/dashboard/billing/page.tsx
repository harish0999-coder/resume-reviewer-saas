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
      <div className="mb-6 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
        Payment received — your account has been upgraded to Pro.
      </div>
    );
  }

  if (checkoutState === "cancelled") {
    return (
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
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
    async function loadUser() {
      try {
        const res = await fetch("/api/me");

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setMe(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  async function handleUpgrade() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManage() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to open billing portal.");
    } finally {
      setLoading(false);
    }
  }

  const isPro = me?.plan === "PRO";

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-1 text-2xl font-bold">Billing</h1>

        <p className="mb-8 text-sm text-white/50">
          Manage your plan and payment method.
        </p>

        <Suspense fallback={null}>
          <CheckoutBanner />
        </Suspense>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">
                Current plan
              </p>

              <p className="mt-1 text-2xl font-bold">
                {me?.plan ?? "..."}
              </p>

              {me?.subscriptionStatus && (
                <p className="mt-1 text-xs text-white/40">
                  Status: {me.subscriptionStatus}
                </p>
              )}
            </div>

            {isPro ? (
              <button
                onClick={handleManage}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? "Loading..." : "Manage / Cancel"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Loading..." : "Upgrade to Pro — $9/mo"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-white/30">
          Payments are processed by Stripe in test mode. Use card number
          <strong> 4242 4242 4242 4242 </strong>
          with any future expiry date and any CVC to simulate a successful
          payment.
        </p>
      </div>
    </main>
  );
}
