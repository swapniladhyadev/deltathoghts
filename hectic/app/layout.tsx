import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BoardNotes AI 🎓 | YouTube Lecture to Study Notes for JEE, NEET & Boards",
  description: "Extract teacher board writing and spoken lectures into structured study notes, LaTeX math formulas, quizzes, and 3D flashcards.",
  keywords: ["JEE Main", "JEE Advanced", "NEET", "Board Notes", "YouTube Lecture Summarizer", "AI Study Assistant", "Physics Wallah Notes"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        {/* Glow ambient backgrounds */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-600/15 via-teal-600/10 to-cyan-600/15 blur-[140px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
