"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { Calendar, CheckCircle2, Download } from "lucide-react";
import { SESSIONS, MAX_SPOTS } from "@/lib/sessions";

type Counts = Record<string, number>;

function generateICS(selectedIds: string[], name: string): string {
  const events = SESSIONS.filter((s) => selectedIds.includes(s.id)).map((s) => {
    const [d, m, y] = s.date.split("-");
    const dtStart = `${y}${m}${d}T${s.start.replace(":", "")}00`;
    const dtEnd   = `${y}${m}${d}T${s.end.replace(":", "")}00`;
    return [
      "BEGIN:VEVENT",
      `DTSTART;TZID=Europe/Amsterdam:${dtStart}`,
      `DTEND;TZID=Europe/Amsterdam:${dtEnd}`,
      "SUMMARY:Klooisessie – Digitale innovatie",
      "LOCATION:Kampereiland",
      `DESCRIPTION:Geregistreerd door ${name}`,
      `UID:klooisessie-${s.id}@gemeentekampen`,
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gemeente Kampen//Klooisessies//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function KlooisessieSignup() {
  const [counts, setCounts]             = useState<Counts>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [selected, setSelected]         = useState<string[]>([]);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("klooisessie_registrations")
      .select("session_ids")
      .then(({ data, error: e }) => {
        if (e) { console.error(e); }
        const c: Counts = {};
        (data ?? []).forEach((row: { session_ids: string[] }) => {
          row.session_ids.forEach((id) => { c[id] = (c[id] ?? 0) + 1; });
        });
        setCounts(c);
        setLoadingCounts(false);
      });
  }, []);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || selected.length === 0) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await getSupabase()
      .from("klooisessie_registrations")
      .insert({ name: name.trim(), email: email.trim(), session_ids: selected });

    if (insertError) {
      setError("Inschrijving mislukt. Probeer het opnieuw.");
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const downloadICS = () => {
    const blob = new Blob([generateICS(selected, name)], { type: "text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "klooisessies.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-7 w-full flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={42} className="text-green-500" />
        <div>
          <p className="font-bold text-green-800 text-lg">Je bent ingeschreven!</p>
          <p className="text-sm text-green-700 mt-1">
            Bevestiging wordt verstuurd naar <span className="font-medium">{email}</span>.
          </p>
        </div>
        <button
          onClick={downloadICS}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
        >
          <Download size={16} />
          Zet in mijn agenda (.ics)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Calendar size={22} className="text-blue-500 flex-shrink-0" />
        <div>
          <h2 className="font-bold text-slate-800">Schrijf je in voor een Klooisessie</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Klooisessie – Digitale innovatie · Kampereiland · max. {MAX_SPOTS} plekken per sessie
          </p>
        </div>
      </div>

      {loadingCounts ? (
        <p className="text-sm text-slate-400">Beschikbaarheid laden…</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {SESSIONS.map((s) => {
              const taken = counts[s.id] ?? 0;
              const full  = taken >= MAX_SPOTS;
              const on    = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={full}
                  onClick={() => !full && toggle(s.id)}
                  className={`flex items-center justify-between w-full rounded-xl border-2 px-4 py-3 transition-all duration-150 ${
                    full
                      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                      : on
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        on ? "bg-blue-500 border-blue-500" : "border-slate-300 bg-white"
                      }`}
                    >
                      {on && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-xs text-slate-400">{s.start}–{s.end}</span>
                  </div>
                  <span className={`text-xs font-semibold ${full ? "text-red-400" : "text-slate-400"}`}>
                    {full ? "Vol" : `${MAX_SPOTS - taken} plek${MAX_SPOTS - taken === 1 ? "" : "ken"}`}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Jouw naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="email"
              placeholder="Jouw e-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting || selected.length === 0 || !name.trim() || !email.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-blue-100 transition-all duration-200"
          >
            {submitting
              ? "Inschrijven…"
              : selected.length === 0
              ? "Kies een sessie"
              : `Inschrijven voor ${selected.length} sessie${selected.length !== 1 ? "s" : ""}`}
          </button>
        </form>
      )}
    </div>
  );
}
