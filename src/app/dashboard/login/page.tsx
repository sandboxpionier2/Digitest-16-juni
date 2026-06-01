"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Inloggen mislukt");
        return;
      }

      router.push(from.startsWith("/dashboard") ? from : "/dashboard");
      router.refresh();
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 sm:py-8 max-w-md mx-auto w-full min-w-0 px-1">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-kampen-teal" aria-hidden />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Alleen voor het innovatieteam. Voer het wachtwoord in om verder te gaan.
        </p>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Wachtwoord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-kampen-teal/40 focus:border-kampen-teal"
              placeholder="Wachtwoord"
            />
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Bezig…" : "Inloggen"}
          </Button>
        </form>
      </Card>

      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
        ← Terug naar de startpagina
      </Link>
    </div>
  );
}

export default function DashboardLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-slate-400 text-sm">Laden…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
