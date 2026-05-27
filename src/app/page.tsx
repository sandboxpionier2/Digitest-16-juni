import Link from "next/link";
import { ArrowRight, Zap, Users, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center gap-12 py-12">
      {/* Hero */}
      <div className="max-w-2xl flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100">
          <Zap size={14} />
          Digitale Zelftest — Gemeente Kampen
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
          Hoe digitaal{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            ben jij?
          </span>
        </h1>

        <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
          In 6 korte vragen ontdek je jouw digitale profiel. De test is positief,
          anoniem en duurt minder dan 2 minuten. Klaar om je digitale kracht te
          ontdekken?
        </p>

        <Link
          href="/test"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-lg"
        >
          Start de test
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full max-w-3xl border-t border-slate-100" />

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {[
          {
            icon: <Zap size={22} className="text-blue-500" />,
            bg: "bg-blue-50",
            title: "Snel & positief",
            desc: "6 vragen, 2 minuten, geen goed of fout. Gewoon eerlijk kijken naar jezelf.",
          },
          {
            icon: <Users size={22} className="text-teal-500" />,
            bg: "bg-teal-50",
            title: "Volledig anoniem",
            desc: "We slaan geen persoonsgegevens op. Alleen jouw digitale profiel telt.",
          },
          {
            icon: <BarChart3 size={22} className="text-indigo-500" />,
            bg: "bg-indigo-50",
            title: "Collectief inzicht",
            desc: "De resultaten helpen het innovatieteam van Gemeente Kampen.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3 text-left hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}>
              {f.icon}
            </div>
            <p className="font-semibold text-slate-800">{f.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Dashboard link */}
      <p className="text-sm text-slate-400">
        Innovatieteam?{" "}
        <Link href="/dashboard" className="text-blue-500 hover:underline font-medium">
          Bekijk het dashboard →
        </Link>
      </p>
    </div>
  );
}
