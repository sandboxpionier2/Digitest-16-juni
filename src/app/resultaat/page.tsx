"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, type ReactNode } from "react";
import { Home, Share2, Compass, Rocket, Star, Check } from "lucide-react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import {
  PROFILE_CONTENT,
  getProfileFromScore,
  type ProfileName,
  ALL_PROFILES,
} from "@/lib/survey";

const PROFILE_ICONS: Record<ProfileName, ReactNode> = {
  "De Digitale Verkenner": <Compass size={44} className="text-blue-600" aria-hidden />,
  "De Digitale Doorpakker": <Rocket size={44} className="text-teal-600" aria-hidden />,
  "De Digitale Pionier": <Star size={44} className="text-amber-500" aria-hidden />,
};

function resolveProfile(
  scoreParam: string | null,
  profileParam: string | null
): ProfileName {
  if (profileParam) {
    const decoded = decodeURIComponent(profileParam) as ProfileName;
    if (ALL_PROFILES.includes(decoded)) return decoded;
  }
  const score = Number(scoreParam);
  if (!Number.isNaN(score) && score >= 6 && score <= 18) {
    return getProfileFromScore(score);
  }
  return "De Digitale Verkenner";
}

function ResultContent() {
  const params = useSearchParams();
  const profile = resolveProfile(params.get("score"), params.get("profile"));
  const content = PROFILE_CONTENT[profile];
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.origin : "";
    const text = `Ik ben een ${profile} bij de Gemeente Kampen! Doe ook de test op ${url}`;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Hoe digitaal ben jij?",
          text,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareFeedback("Gekopieerd naar het klembord!");
      setTimeout(() => setShareFeedback(null), 3000);
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareFeedback("Gekopieerd naar het klembord!");
        setTimeout(() => setShareFeedback(null), 3000);
      } catch {
        setShareFeedback("Delen mislukt. Kopieer de tekst handmatig.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center gap-8 py-8 text-center">
      <div
        className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${content.gradientLight} ${content.border} border-2 flex items-center justify-center shadow-sm`}
      >
        {PROFILE_ICONS[profile]}
      </div>

      <div className="flex flex-col gap-2">
        <span className={`text-xs font-semibold uppercase tracking-widest ${content.textColor}`}>
          Jouw digitale profiel
        </span>
        <h1
          className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent leading-tight`}
        >
          {content.title}
        </h1>
      </div>

      <Card padding="lg" className="w-full text-left">
        <p className="text-slate-700 leading-relaxed text-base">{content.message}</p>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kampen-teal"
        >
          <Home size={18} aria-hidden />
          Terug naar start
        </Link>
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={handleShare}
          icon={
            shareFeedback ? (
              <Check size={18} aria-hidden />
            ) : (
              <Share2 size={18} aria-hidden />
            )
          }
        >
          {shareFeedback ?? "Deel mijn resultaat"}
        </Button>
      </div>
    </div>
  );
}

export default function ResultaatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-slate-400">
          Laden...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
