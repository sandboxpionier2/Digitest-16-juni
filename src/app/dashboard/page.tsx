"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
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
  Legend,
} from "recharts";
import { Users, RefreshCw, AlertCircle, Trash2 } from "lucide-react";
import { SESSIONS, MAX_SPOTS } from "@/lib/sessions";
import Link from "next/link";
import Card from "@/components/Card";
import {
  ALL_PROFILES,
  PROFILE_COLORS,
  type ProfileName,
} from "@/lib/survey";

type KlooisessieRegistration = {
  name: string;
  email: string;
  session_ids: string[];
};

type SurveyResult = {
  profile: ProfileName | string;
  theme_1_score: number;
  theme_2_score: number;
  total_score: number;
};

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

function normalizeProfile(raw: string): ProfileName | null {
  if (ALL_PROFILES.includes(raw as ProfileName)) return raw as ProfileName;
  // Legacy profile keys from earlier versions
  const legacy: Record<string, ProfileName> = {
    Ontdekker: "De Digitale Verkenner",
    Versneller: "De Digitale Doorpakker",
    Koploper: "De Digitale Pionier",
  };
  return legacy[raw] ?? null;
}

export default function DashboardPage() {
  const [results, setResults]             = useState<SurveyResult[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [confirmClear, setConfirmClear]   = useState(false);
  const [clearing, setClearing]           = useState(false);
  const [clearError, setClearError]       = useState<string | null>(null);
  const [klooisessies, setKlooisessies]   = useState<KlooisessieRegistration[]>([]);
  const [klooisessiesLoading, setKlooisessiesLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getSupabase()
        .from("survey_results")
        .select("profile, theme_1_score, theme_2_score, total_score");

      if (fetchError) throw fetchError;
      setResults((data ?? []) as SurveyResult[]);
    } catch (e) {
      console.error(e);
      setError("Kan geen data ophalen. Controleer je Supabase-configuratie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getSupabase()
      .from("klooisessie_registrations")
      .select("name, email, session_ids")
      .then(({ data }) => {
        setKlooisessies((data ?? []) as KlooisessieRegistration[]);
        setKlooisessiesLoading(false);
      });
  }, []);

  const handleClearResults = async () => {
    setClearing(true);
    setClearError(null);
    try {
      const res = await fetch("/api/dashboard/results", { method: "DELETE" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? "Wissen mislukt");
      }
      setResults([]);
      setConfirmClear(false);
    } catch (e) {
      console.error(e);
      setClearError(
        e instanceof Error ? e.message : "Kon uitslagen niet wissen."
      );
    } finally {
      setClearing(false);
    }
  };

  const total = results.length;

  const profileCounts = ALL_PROFILES.map((p) => ({
    name: p,
    value: results.filter((r) => normalizeProfile(String(r.profile)) === p).length,
  }));

  const themeAvgData = [
    {
      name: "Thema 1",
      subtitle: "Oplossen van problemen",
      score: avg(results.map((r) => r.theme_1_score)),
      fill: "#2563eb",
    },
    {
      name: "Thema 2",
      subtitle: "Communicatie en samenwerking",
      score: avg(results.map((r) => r.theme_2_score)),
      fill: "#0d9488",
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-10 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Geaggregeerde, anonieme resultaten — Innovatieteam Gemeente Kampen
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {!loading && total > 0 && !confirmClear && (
            <button
              type="button"
              onClick={() => {
                setClearError(null);
                setConfirmClear(true);
              }}
              className="touch-target inline-flex items-center justify-center gap-2 text-sm bg-white border border-red-200 hover:bg-red-50 text-red-700 font-medium px-4 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 w-full sm:w-auto"
            >
              <Trash2 size={14} aria-hidden />
              Alle uitslagen wissen
            </button>
          )}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading || clearing}
            className="touch-target inline-flex items-center justify-center gap-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-kampen-teal w-full sm:w-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden />
            Vernieuwen
          </button>
        </div>
      </div>

      {confirmClear && (
        <div
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          role="alertdialog"
          aria-labelledby="clear-results-title"
          aria-describedby="clear-results-desc"
        >
          <div>
            <p id="clear-results-title" className="font-semibold text-amber-900 text-sm">
              Alle {total} uitslagen permanent wissen?
            </p>
            <p id="clear-results-desc" className="text-amber-800 text-sm mt-0.5">
              Dit kan niet ongedaan worden gemaakt. Handig om testdata op te schonen.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              disabled={clearing}
              className="touch-target text-sm font-medium px-4 py-2.5 rounded-lg border border-amber-300 text-amber-900 hover:bg-amber-100 disabled:opacity-50 w-full sm:w-auto"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleClearResults}
              disabled={clearing}
              className="touch-target text-sm font-semibold px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 w-full sm:w-auto"
            >
              {clearing ? "Bezig…" : "Ja, alles wissen"}
            </button>
          </div>
        </div>
      )}

      {clearError && (
        <div
          className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-semibold text-red-700 text-sm">Wissen mislukt</p>
            <p className="text-red-600 text-sm mt-0.5">{clearError}</p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-semibold text-red-700 text-sm">Fout bij laden</p>
            <p className="text-red-600 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Top metric */}
      <Card className="flex items-center gap-4 sm:gap-5 w-full sm:max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Users size={28} className="text-kampen-blue" aria-hidden />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Totaal aantal tests</p>
          <p className="text-4xl font-extrabold text-slate-900 tabular-nums">
            {loading ? "—" : total}
          </p>
        </div>
      </Card>

      {!loading && !error && total === 0 && (
        <Card className="text-center py-12 flex flex-col items-center gap-4">
          <p className="font-bold text-slate-800 text-lg">Nog geen inzendingen</p>
          <p className="text-slate-500 text-sm max-w-sm">
            Deel de test met collega&apos;s. Zodra de eerste resultaten binnenkomen,
            verschijnen ze hier.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-kampen-gradient text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
          >
            Ga naar de test
          </Link>
        </Card>
      )}

      {!loading && total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-slate-800">Verdeling profielen</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                De Digitale Verkenner · Doorpakker · Pionier
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[260px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profileCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="75%"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {profileCounts.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={PROFILE_COLORS[entry.name as ProfileName]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _, props) => [
                    `${v ?? 0} deelnemer${v === 1 ? "" : "s"}`,
                    (props.payload as { name?: string })?.name ?? "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm">
              {profileCounts.map((p) => (
                <li key={p.name} className="flex items-start sm:items-center justify-between gap-3">
                  <span className="flex items-start sm:items-center gap-2 text-slate-600 min-w-0 flex-1">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1 sm:mt-0"
                      style={{
                        background: PROFILE_COLORS[p.name as ProfileName],
                      }}
                      aria-hidden
                    />
                    <span className="text-sm leading-snug break-words">{p.name}</span>
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums flex-shrink-0">
                    {p.value}{" "}
                    <span className="text-slate-400 font-normal text-xs">
                      ({total > 0 ? Math.round((p.value / total) * 100) : 0}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-slate-800">Gemiddelde score per thema</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Maximaal 9 punten per thema (3 vragen × 3 punten)
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[260px] min-w-0 -mx-1 sm:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={themeAvgData}
                margin={{ top: 8, right: 8, left: -12, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 9]} tick={{ fontSize: 11, fill: "#64748b" }} width={28} />
                <Tooltip
                  formatter={(v, _, props) => [
                    `${v ?? 0} punten`,
                    (props.payload as { subtitle?: string })?.subtitle ?? "",
                  ]}
                />
                <Legend />
                <Bar dataKey="score" name="Gemiddelde score" radius={[8, 8, 0, 0]}>
                  {themeAvgData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Klooisessies */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">Klooisessies</h2>
          <p className="text-slate-500 text-sm mt-1">
            Klooisessie – Digitale innovatie · Kampereiland · max. {MAX_SPOTS} plekken per sessie
          </p>
        </div>
        {klooisessiesLoading ? (
          <p className="text-slate-400 text-sm">Laden…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {SESSIONS.map((s) => {
              const registrants = klooisessies.filter((r) => r.session_ids.includes(s.id));
              const taken = registrants.length;
              const full  = taken >= MAX_SPOTS;
              return (
                <Card key={s.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800">{s.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.date} · {s.start}–{s.end}</p>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      full ? "bg-red-100 text-red-600" : taken === 0 ? "bg-slate-100 text-slate-400" : "bg-green-100 text-green-700"
                    }`}>
                      {taken}/{MAX_SPOTS}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3">
                    <div
                      className={`h-1.5 rounded-full ${full ? "bg-red-400" : "bg-teal-400"}`}
                      style={{ width: `${(taken / MAX_SPOTS) * 100}%` }}
                    />
                  </div>
                  {registrants.length === 0 ? (
                    <p className="text-sm text-slate-400">Nog geen inschrijvingen</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {registrants.map((r, i) => (
                        <li key={`${r.email}-${i}`} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-medium flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-medium text-slate-700">{r.name}</span>
                          <span className="text-slate-400">{r.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
