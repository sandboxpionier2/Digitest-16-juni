"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, TrendingUp, BarChart2, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

type SurveyResult = {
  profile: "Ontdekker" | "Versneller" | "Koploper";
  theme_1_score: number;
  theme_2_score: number;
  total_score: number;
};

const PROFILE_COLORS: Record<string, string> = {
  Ontdekker: "#3b82f6",
  Versneller: "#14b8a6",
  Koploper: "#f59e0b",
};

const PROFILE_LABELS: Record<string, string> = {
  Ontdekker: "De Digitale Ontdekker",
  Versneller: "De Digitale Versneller",
  Koploper: "De Digitale Koploper",
};

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}

export default function DashboardPage() {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, "survey_results"));
      setResults(snap.docs.map((d) => d.data() as SurveyResult));
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
      setError("Kan geen data ophalen. Controleer je Firebase configuratie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = results.length;

  const profileCounts = (["Ontdekker", "Versneller", "Koploper"] as const).map((p) => ({
    name: PROFILE_LABELS[p],
    shortName: p,
    value: results.filter((r) => r.profile === p).length,
  }));

  const biggestGroup =
    total > 0
      ? profileCounts.reduce((a, b) => (a.value > b.value ? a : b)).shortName
      : null;

  const themeAvgData = [
    {
      name: "Thema 1",
      label: "Oplossen van problemen",
      score: avg(results.map((r) => r.theme_1_score)),
      fill: "#3b82f6",
    },
    {
      name: "Thema 2",
      label: "Communicatie & samenwerking",
      score: avg(results.map((r) => r.theme_2_score)),
      fill: "#14b8a6",
    },
  ];

  const scoreDistData = Array.from({ length: 13 }, (_, i) => ({
    score: (i + 6).toString(),
    aantal: results.filter((r) => r.total_score === i + 6).length,
  }));

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Anonieme resultaten — Hoe digitaal ben jij?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Bijgewerkt: {lastRefresh.toLocaleTimeString("nl-NL")}
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Vernieuwen
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 text-sm">Fout bij laden</p>
            <p className="text-red-600 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Users size={22} className="text-blue-500" />,
            bg: "bg-blue-50",
            label: "Totaal ingevuld",
            value: loading ? "—" : total.toString(),
          },
          {
            icon: <TrendingUp size={22} className="text-teal-500" />,
            bg: "bg-teal-50",
            label: "Grootste groep",
            value: loading ? "—" : biggestGroup ? `De Digitale ${biggestGroup}` : "—",
          },
          {
            icon: <BarChart2 size={22} className="text-indigo-500" />,
            bg: "bg-indigo-50",
            label: "Gemiddelde totaalscore",
            value: loading ? "—" : total > 0 ? avg(results.map((r) => r.total_score)).toString() : "—",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{kpi.label}</p>
              <p className="text-2xl font-extrabold text-slate-800 leading-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && !error && total === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
            <BarChart2 size={28} className="text-amber-500" />
          </div>
          <div>
            <p className="font-bold text-amber-800 text-lg">Nog geen inzendingen</p>
            <p className="text-amber-600 text-sm mt-1">
              Deel de testlink met je collega's om resultaten te verzamelen.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Ga naar de test
          </Link>
        </div>
      )}

      {/* Charts */}
      {!loading && total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart — profile distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-slate-800">Verdeling profielen</h2>
              <p className="text-xs text-slate-400 mt-0.5">Welk type digitale medewerker overheerst?</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={profileCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {profileCounts.map((entry) => (
                    <Cell key={entry.shortName} fill={PROFILE_COLORS[entry.shortName]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _, props) => [
                    `${v} deelnemers`,
                    (props.payload as { shortName?: string })?.shortName ?? "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {profileCounts.map((p) => (
                <div key={p.shortName} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: PROFILE_COLORS[p.shortName] }}
                    />
                    <span className="text-slate-600">{p.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{p.value}</span>
                    <span className="text-slate-400 text-xs">
                      ({total > 0 ? Math.round((p.value / total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart — theme averages */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-slate-800">Gemiddelde score per thema</h2>
              <p className="text-xs text-slate-400 mt-0.5">Max. 9 punten per thema (3 vragen × 3)</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={themeAvgData}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis domain={[0, 9]} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v, _, props) => [
                    v,
                    (props.payload as { label?: string })?.label ?? "",
                  ]}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Gemiddelde">
                  {themeAvgData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score distribution — full width */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 lg:col-span-2">
            <div>
              <h2 className="font-bold text-slate-800">Verdeling totaalscores</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Schaal 6–18 punten · Ontdekker: 6–10 · Versneller: 11–14 · Koploper: 15–18
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={scoreDistData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="score" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip formatter={(v) => [`${v} deelnemers`, "Aantal"]} />
                <Bar dataKey="aantal" name="Deelnemers" radius={[4, 4, 0, 0]}>
                  {scoreDistData.map((entry, i) => {
                    const score = i + 6;
                    const color =
                      score <= 10
                        ? "#3b82f6"
                        : score <= 14
                        ? "#14b8a6"
                        : "#f59e0b";
                    return <Cell key={i} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
