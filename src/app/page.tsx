import { ArrowRight, Zap, Users, BarChart3 } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import Card from "@/components/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 py-8">
      {/* Hero */}
      <section className="w-full max-w-3xl rounded-3xl bg-kampen-hero text-white px-8 py-14 sm:px-12 sm:py-16 text-center shadow-xl shadow-blue-900/20">
        <p className="inline-flex items-center gap-2 bg-white/15 text-white/95 text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 mb-6">
          <Zap size={14} aria-hidden />
          Gemeente Kampen
        </p>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          Hoe digitaal ben jij?
        </h1>

        <p className="mt-6 text-lg text-blue-50/95 leading-relaxed max-w-xl mx-auto">
          Welkom bij deze korte, positieve zelftest. In een paar minuten ontdek je
          jouw digitale profiel binnen Gemeente Kampen — zonder goed of fout, volledig
          anoniem en met een helder beeld van waar jij staat in de digitale wereld.
        </p>

        <div className="mt-10">
          <ButtonLink
            href="/test"
            className="!bg-white !text-kampen-blue hover:!bg-blue-50 !shadow-lg text-lg px-8 py-4"
            icon={<ArrowRight size={20} aria-hidden />}
          >
            Start de test
          </ButtonLink>
        </div>
      </section>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {[
          {
            icon: <Zap size={22} className="text-kampen-blue" aria-hidden />,
            bg: "bg-blue-50",
            title: "Snel & positief",
            desc: "6 vragen over 2 thema's. Geen examen — wel een eerlijk beeld van jouw digitale manier van werken.",
          },
          {
            icon: <Users size={22} className="text-kampen-teal" aria-hidden />,
            bg: "bg-teal-50",
            title: "Volledig anoniem",
            desc: "We slaan geen naam of e-mailadres op. Alleen geaggregeerde scores voor het innovatieteam.",
          },
          {
            icon: <BarChart3 size={22} className="text-indigo-500" aria-hidden />,
            bg: "bg-indigo-50",
            title: "Collectief inzicht",
            desc: "Jouw bijdrage helpt het innovatieteam gerichter te ondersteunen en te vernieuwen.",
          },
        ].map((f) => (
          <Card key={f.title} className="flex flex-col gap-3 text-left hover:shadow-md transition-shadow">
            <div
              className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}
            >
              {f.icon}
            </div>
            <p className="font-semibold text-slate-800">{f.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        Innovatieteam?{" "}
        <Link href="/dashboard" className="text-kampen-teal hover:underline font-medium">
          Bekijk het dashboard →
        </Link>
      </p>
    </div>
  );
}
