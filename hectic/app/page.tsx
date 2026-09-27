import React from "react";
import Link from "next/link";
import { LectureInputSuite } from "@/components/LectureInputSuite";
import { SAMPLE_NOTES } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Tv, 
  BrainCircuit, 
  FileText, 
  ArrowRight,
  Flame,
  Globe,
  UploadCloud
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full space-y-20 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-lg">
          <Flame className="h-4 w-4 fill-emerald-400" />
          Engineered for JEE, NEET & Board Aspirants 🇮🇳
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Turn Any Video Link or File into{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            AI Study Notes & Quizzes
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Paste links from <strong className="text-white">YouTube, Instagram Reels, Facebook, TikTok, Twitter or Vimeo</strong>—or upload downloaded MP4 files. BoardNotes AI extracts blackboard derivations, teacher tips, LaTeX math, MCQs, and 3D flashcards.
        </p>

        {/* Input Suite with Universal Link Support */}
        <LectureInputSuite />
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Universal Platform Support Powered by yt-dlp
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Extract study notes seamlessly from any educational video hosted anywhere on the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Any Video Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste links from YouTube, Instagram, Facebook Watch, TikTok, Twitter/X, Reddit, or Vimeo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Direct File Upload</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload downloaded MP4, MOV, WebM, or MKV lecture recordings from your device (Max 500MB).
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Tv className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Board OCR Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts step-by-step blackboard derivations, diagrams, and LaTeX math equations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Quizzes & PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates 5-10 JEE/NEET MCQs, 3D formula flashcards, and downloadable A4 PDF notes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Live Sample Notes */}
      <section id="sample-notes" className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Explore Live Demos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sample Notes Generated by AI
            </h2>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 text-xs">
              View All Notes <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_NOTES.map((sample) => (
            <Card
              key={sample.id}
              className="border-slate-800 bg-slate-900/90 hover:border-emerald-500/40 transition-all group overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={sample.subject.toLowerCase() as any}>
                    {sample.subject}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {sample.exam_category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {sample.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.summary}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-xs text-slate-500 font-medium">
                    {sample.channel_name}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link href={`/notes/${sample.id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        View Note
                      </Button>
                    </Link>
                    <Link href={`/quiz/${sample.id}`}>
                      <Button variant="gradient" size="sm" className="text-xs gap-1">
                        <Sparkles className="h-3 w-3" /> Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
