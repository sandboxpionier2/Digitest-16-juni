import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoe digitaal ben jij? | Gemeente Kampen",
  description:
    "Ontdek jouw digitale profiel met deze korte, positieve zelftest voor medewerkers van Gemeente Kampen.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body
        className={`${inter.className} min-h-screen min-h-[100dvh] bg-slate-50 flex flex-col overflow-x-hidden`}
      >
        <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 safe-top">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-kampen-gradient shadow-sm flex-shrink-0"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  Gemeente Kampen
                </p>
                <p className="text-xs text-slate-400 truncate">Hoe digitaal ben jij?</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full min-w-0 px-4 py-6 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="text-center text-xs text-slate-400 px-4 py-6 sm:py-8 border-t border-slate-100 safe-bottom">
          © {new Date().getFullYear()} Gemeente Kampen — Afdeling Innovatie
        </footer>
      </body>
    </html>
  );
}
