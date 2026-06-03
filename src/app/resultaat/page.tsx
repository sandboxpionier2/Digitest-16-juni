"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Home, Compass, Rocket, Star } from "lucide-react";
import Card from "@/components/Card";
import KlooisessieSignup from "@/components/KlooisessieSignup";
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

  return (
    <div className="max-w-lg mx-auto w-full min-w-0 flex flex-col items-center gap-6 sm:gap-8 py-4 sm:py-8 text-center px-1">
      <div
        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${content.gradientLight} ${content.border} border-2 flex items-center justify-center shadow-sm`}
      >
        {PROFILE_ICONS[profile]}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <span className={`text-xs font-semibold uppercase tracking-widest ${content.textColor}`}>
          Jouw digitale profiel
        </span>
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent leading-tight px-1`}
        >
          {content.title}
        </h1>
      </div>

      <Card padding="lg" className="w-full text-left">
        <p className="text-slate-700 leading-relaxed text-base">{content.message}</p>
      </Card>

      <div className="w-full border-t border-slate-100 pt-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 text-center mb-4">
          Wil je verder groeien?
        </p>
        <KlooisessieSignup />
      </div>

      <Link
        href="/"
        className="touch-target w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 sm:px-6 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kampen-teal"
      >
        <Home size={18} aria-hidden />
        Terug naar start
      </Link>
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
