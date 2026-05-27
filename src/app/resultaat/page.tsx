"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Home, Star, Rocket, Compass, RefreshCw } from "lucide-react";

const PROFILES = {
  Ontdekker: {
    title: "De Digitale Ontdekker",
    subtitle: "Een solide basis om op te bouwen",
    gradient: "from-blue-500 to-indigo-600",
    gradientLight: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    textColor: "text-blue-600",
    badgeBg: "bg-blue-100",
    icon: <Compass size={44} className="text-blue-500" />,
    message:
      "Je hebt een solide basis! Je doet je werk goed met de tools die je kent. Er ligt een mooie kans om stapje voor stapje nieuwe handigheidjes te ontdekken.",
    tip: "Tip: Probeer volgende week één nieuwe functie in een tool die je al gebruikt.",
  },
  Versneller: {
    title: "De Digitale Versneller",
    subtitle: "Je bent lekker op weg!",
    gradient: "from-teal-500 to-cyan-500",
    gradientLight: "from-teal-50 to-cyan-50",
    border: "border-teal-100",
    textColor: "text-teal-600",
    badgeBg: "bg-teal-100",
    icon: <Rocket size={44} className="text-teal-500" />,
    message:
      "Je bent lekker op weg! Je pakt nieuwe dingen vlot op. Met een beetje extra lef word je al snel een digitale voorloper.",
    tip: "Tip: Deel jouw digitale kennis met een collega en help ze verder te groeien.",
  },
  Koploper: {
    title: "De Digitale Koploper",
    subtitle: "Jij bent een echte digitale pionier!",
    gradient: "from-amber-400 to-orange-500",
    gradientLight: "from-amber-50 to-orange-50",
    border: "border-amber-100",
    textColor: "text-amber-600",
    badgeBg: "bg-amber-100",
    icon: <Star size={44} className="text-amber-500" />,
    message:
      "Jij bent een echte digitale pionier! Je omarmt vernieuwing en loopt voorop. Jouw uitdaging: neem collega's mee in je enthousiasme!",
    tip: "Tip: Overweeg een interne lunch-sessie te geven over jouw favoriete digitale tool.",
  },
};

function ResultContent() {
  const params = useSearchParams();
  const profileKey = (params.get("profile") ?? "Ontdekker") as keyof typeof PROFILES;
  const profile = PROFILES[profileKey] ?? PROFILES.Ontdekker;

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center gap-8 py-8 text-center">
      {/* Icon */}
      <div
        className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${profile.gradientLight} ${profile.border} border-2 flex items-center justify-center shadow-sm`}
      >
        {profile.icon}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <span className={`text-xs font-semibold uppercase tracking-widest ${profile.textColor}`}>
          Jouw digitale profiel
        </span>
        <h1
          className={`text-4xl font-extrabold bg-gradient-to-r ${profile.gradient} bg-clip-text text-transparent leading-tight`}
        >
          {profile.title}
        </h1>
        <p className="text-slate-500 font-medium">{profile.subtitle}</p>
      </div>

      {/* Message card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-7 w-full">
        <p className="text-slate-600 leading-relaxed text-lg">{profile.message}</p>
      </div>

      {/* Tip */}
      <div className={`bg-gradient-to-br ${profile.gradientLight} border ${profile.border} rounded-2xl px-6 py-5 w-full text-left`}>
        <p className={`text-sm font-semibold ${profile.textColor} mb-1`}>Volgende stap</p>
        <p className="text-sm text-slate-600 leading-relaxed">{profile.tip}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Home size={18} />
          Terug naar start
        </Link>
        <Link
          href="/test"
          className={`flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r ${profile.gradient} text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5`}
        >
          <RefreshCw size={18} />
          Opnieuw doen
        </Link>
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
