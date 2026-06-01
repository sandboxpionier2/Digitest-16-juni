import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoe digitaal ben jij? | Gemeente Kampen",
  description:
    "Ontdek jouw digitale profiel met deze korte, positieve zelftest voor medewerkers van Gemeente Kampen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col`}>
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-kampen-gradient shadow-sm"
                aria-hidden
              />
              <div>
                <p className="font-semibold text-slate-800 text-sm">Gemeente Kampen</p>
                <p className="text-xs text-slate-400">Hoe digitaal ben jij?</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">{children}</main>
        <footer className="text-center text-xs text-slate-400 py-8 border-t border-slate-100">
          © {new Date().getFullYear()} Gemeente Kampen — Afdeling Innovatie
        </footer>
      </body>
    </html>
  );
}
