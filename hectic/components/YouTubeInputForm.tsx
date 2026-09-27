"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Sparkles, ArrowRight, CheckCircle2, Loader2, Play } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const QUICK_SAMPLES = [
  {
    title: "Rotational Motion (Physics Wallah)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    exam: "JEE Main & Advanced",
    subject: "Physics",
  },
  {
    title: "Chemical Equilibrium (Unacademy NEET)",
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    exam: "NEET",
    subject: "Chemistry",
  },
];

export function YouTubeInputForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [examCategory, setExamCategory] = useState("JEE Main & Advanced");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setErrorMsg("Please paste a valid YouTube video link.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url, examCategory }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process lecture video.");
      }

      router.push(`/notes/${data.noteId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleQuickSample = (sampleUrl: string, sampleExam: string) => {
    setUrl(sampleUrl);
    setExamCategory(sampleExam);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl transition-all focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Input field */}
          <div className="relative w-full flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 flex items-center justify-center">
              <Youtube className="h-5 w-5 fill-red-500/20" />
            </div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube lecture URL (e.g., https://youtube.com/watch?v=...)"
              className="pl-12 pr-4 h-14 bg-slate-950/90 text-white placeholder:text-slate-500 rounded-xl border-slate-800 focus:border-emerald-500 text-base"
              disabled={isLoading}
            />
          </div>

          {/* Exam Selector & Submit Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={examCategory}
              onChange={(e) => setExamCategory(e.target.value)}
              disabled={isLoading}
              className="h-14 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="JEE Main & Advanced">🎯 JEE Main / Adv</option>
              <option value="NEET">🩺 NEET UG</option>
              <option value="CBSE Boards">📚 Class 11/12 Boards</option>
            </select>

            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading}
              className="h-14 px-6 gap-2 rounded-xl text-base whitespace-nowrap min-w-[140px] shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 fill-slate-950" />
                  Generate Notes
                </>
              )}
            </Button>
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs sm:text-sm text-red-400 font-medium px-2">
            ⚠️ {errorMsg}
          </p>
        )}
      </form>

      {/* Quick Sample Links */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span className="text-slate-400 font-medium">Try Sample Lectures:</span>
        {QUICK_SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickSample(sample.url, sample.exam)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
          >
            <Play className="h-3 w-3 fill-emerald-400 text-emerald-400" />
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
}
