"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ProgressBar from "@/components/ProgressBar";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe reageer je als een digitaal systeem of programma op je werk niet doet wat je wilt?",
    options: [
      { label: "A", text: "Ik bel de helpdesk of vraag een collega om hulp.", score: 1 },
      { label: "B", text: "Ik denk logisch na en zoek zelf naar de oorzaak.", score: 2 },
      { label: "C", text: "Ik zoek de oorzaak én doe een verbetervoorstel aan de organisatie.", score: 3 },
    ],
  },
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe zet jij digitale tools in om je dagelijkse werk makkelijker te maken?",
    options: [
      { label: "A", text: "Ik gebruik tools op de standaardmanier.", score: 1 },
      { label: "B", text: "Ik probeer soms nieuwe functies uit.", score: 2 },
      { label: "C", text: "Ik ben altijd op zoek naar slimmere manieren en innovaties.", score: 3 },
    ],
  },
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe zorg je dat je bijblijft met nieuwe digitale ontwikkelingen?",
    options: [
      { label: "A", text: "Alleen als het verplicht is via trainingen.", score: 1 },
      { label: "B", text: "Ik lees er af en toe over in nieuws of blogs.", score: 2 },
      { label: "C", text: "Ik zoek actief naar nieuws en experimenteer zelf.", score: 3 },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Hoe werk jij het liefst samen aan een document?",
    options: [
      { label: "A", text: "Ik maak een eigen document en mail het rond.", score: 1 },
      { label: "B", text: "Ik zet het in de cloud en mail de link.", score: 2 },
      { label: "C", text: "We werken standaard samen in de cloud via Teams/SharePoint.", score: 3 },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Hoe gebruik jij digitale diensten voor contact met collega's of burgers?",
    options: [
      { label: "A", text: "Liever fysiek contact of telefonisch.", score: 1 },
      { label: "B", text: "Ik wissel af met beeldbellen.", score: 2 },
      { label: "C", text: "Ik zet actief diverse digitale platforms in.", score: 3 },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Ben je je bewust van je online identiteit en digitale uitstraling?",
    options: [
      { label: "A", text: "Niet echt mee bezig.", score: 1 },
      { label: "B", text: "Ik let er een beetje op.", score: 2 },
      { label: "C", text: "Zeer bewust — ik beheer actief mijn digitale uitstraling.", score: 3 },
    ],
  },
];

function getProfile(total: number): "Ontdekker" | "Versneller" | "Koploper" {
  if (total <= 10) return "Ontdekker";
  if (total <= 14) return "Versneller";
  return "Koploper";
}

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(6).fill(0));
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const prevTheme = step > 0 ? QUESTIONS[step - 1].theme : null;
  const themeChanged = step > 0 && question.theme !== prevTheme;

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = [...answers];
    newAnswers[step] = selected;
    setAnswers(newAnswers);

    if (isLast) {
      setSubmitting(true);
      setError(null);

      const theme1 = newAnswers.slice(0, 3).reduce((a, b) => a + b, 0);
      const theme2 = newAnswers.slice(3, 6).reduce((a, b) => a + b, 0);
      const total = theme1 + theme2;
      const profile = getProfile(total);

      try {
        await addDoc(collection(db, "survey_results"), {
          timestamp: serverTimestamp(),
          theme_1_score: theme1,
          theme_2_score: theme2,
          total_score: total,
          profile,
        });
      } catch (e) {
        console.error("Firestore write failed:", e);
        setError("Opslaan mislukt. Controleer je Firebase configuratie.");
        setSubmitting(false);
        return;
      }

      router.push(`/resultaat?profile=${profile}`);
      return;
    }

    setStep(step + 1);
    setSelected(answers[step + 1] > 0 ? answers[step + 1] : null);
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevStep = step - 1;
    setStep(prevStep);
    setSelected(answers[prevStep] > 0 ? answers[prevStep] : null);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <ProgressBar current={step + 1} total={6} />

      {/* Theme transition banner */}
      {themeChanged && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-xl px-5 py-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0" />
          <p className="text-sm text-teal-700 font-medium">
            Thema 1 afgerond! Nu verder met Thema 2.
          </p>
        </div>
      )}

      {/* Theme label */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${
            question.theme === 1
              ? "text-blue-600 bg-blue-50 border-blue-100"
              : "text-teal-600 bg-teal-50 border-teal-100"
          }`}
        >
          Thema {question.theme}: {question.themeLabel}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          {question.text}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSelected(opt.score)}
              className={`flex items-start gap-4 text-left w-full rounded-xl border-2 px-5 py-4 transition-all duration-150 ${
                selected === opt.score
                  ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  selected === opt.score
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {opt.label}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Vorige
        </button>

        <button
          onClick={handleNext}
          disabled={selected === null || submitting}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {submitting
            ? "Opslaan..."
            : isLast
            ? "Bekijk mijn profiel"
            : "Volgende"}
          {!submitting && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
