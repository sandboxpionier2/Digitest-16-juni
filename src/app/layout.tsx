import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoe digitaal ben jij? | Gemeente Kampen",
  description: "Ontdek jouw digitale profiel met deze korte, positieve zelftest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-500" />
            <span className="font-semibold text-slate-700 text-sm tracking-wide uppercase">
              Gemeente Kampen
            </span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        <footer className="text-center text-xs text-slate-400 py-8">
          © {new Date().getFullYear()} Gemeente Kampen — Afdeling Innovatie
        </footer>
      </body>
    </html>
  );
}
