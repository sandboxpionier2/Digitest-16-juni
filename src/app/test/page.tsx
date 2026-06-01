"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import {
  QUESTIONS,
  getProfileFromScore,
  type ProfileName,
} from "@/lib/survey";

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
      const profile: ProfileName = getProfileFromScore(total);

      const { error: saveError } = await getSupabase().from("survey_results").insert({
        theme_1_score: theme1,
        theme_2_score: theme2,
        total_score: total,
        profile,
      });

      if (saveError) {
        console.error("Supabase write failed:", saveError.message, saveError);
        setError(
          saveError.message.includes("Failed to fetch") ||
            saveError.message.includes("NetworkError")
            ? "Kan Supabase niet bereiken. Controleer in Vercel of NEXT_PUBLIC_SUPABASE_URL op https://<project>.supabase.co staat (niet de secret key)."
            : `Opslaan mislukt: ${saveError.message}`
        );
        setSubmitting(false);
        return;
      }

      const params = new URLSearchParams({
        score: String(total),
        profile: encodeURIComponent(profile),
      });
      router.push(`/resultaat?${params.toString()}`);
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
    <div className="max-w-xl mx-auto w-full min-w-0 flex flex-col gap-5 sm:gap-8">
      <ProgressBar current={step + 1} total={6} />

      {themeChanged && (
        <div
          className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-xl px-4 py-3 sm:px-5 flex items-start sm:items-center gap-3"
          role="status"
        >
          <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0" aria-hidden />
          <p className="text-sm text-teal-800 font-medium">
            Thema 1 afgerond! Nu verder met thema 2: Communicatie en samenwerking.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2">
        <span
          className={`inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest px-2.5 sm:px-3 py-1 rounded-full border leading-snug ${
            question.theme === 1
              ? "text-kampen-blue bg-blue-50 border-blue-100"
              : "text-kampen-teal bg-teal-50 border-teal-100"
          }`}
        >
          Thema {question.theme}: {question.themeLabel}
        </span>
      </div>

      <Card padding="lg" className="flex flex-col gap-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
          {question.text}
        </h2>

        <fieldset className="flex flex-col gap-3 border-0 p-0 m-0">
          <legend className="sr-only">Kies één antwoord</legend>
          {question.options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelected(opt.score)}
              aria-pressed={selected === opt.score}
              className={`touch-target flex items-start gap-3 sm:gap-4 text-left w-full rounded-xl border-2 px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-kampen-teal focus-visible:ring-offset-2 ${
                selected === opt.score
                  ? "border-kampen-teal bg-teal-50 text-slate-800 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-700 hover:border-teal-200 hover:bg-teal-50/40"
              }`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  selected === opt.score
                    ? "bg-kampen-teal text-white"
                    : "bg-white border border-slate-200 text-slate-500"
                }`}
                aria-hidden
              >
                {opt.label}
              </span>
              <span className="text-sm sm:text-base leading-relaxed pt-0.5">{opt.text}</span>
            </button>
          ))}
        </fieldset>
      </Card>

      {error && (
        <div
          className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 sm:gap-4 pb-2 sm:pb-0">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0}
          className="w-full sm:w-auto !px-3 justify-center"
          icon={<ChevronLeft size={16} aria-hidden />}
        >
          Vorige
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={selected === null || submitting}
          className="w-full sm:w-auto justify-center"
          icon={!submitting ? <ChevronRight size={18} aria-hidden /> : undefined}
        >
          {submitting ? "Opslaan..." : isLast ? "Bekijk mijn profiel" : "Volgende"}
        </Button>
      </div>
    </div>
  );
}
