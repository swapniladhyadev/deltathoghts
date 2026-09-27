"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Youtube, 
  UploadCloud, 
  FileVideo, 
  Sparkles, 
  Loader2, 
  Play, 
  AlertCircle,
  Link2,
  Globe,
  Share2,
  Trash2
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { detectPlatform, SupportedPlatform } from "@/lib/ytdlp";

const SUPPORTED_PLATFORMS: Array<{ id: SupportedPlatform; name: string; color: string; icon: string }> = [
  { id: "youtube", name: "YouTube", color: "border-red-500/40 text-red-400 bg-red-500/10", icon: "▶️" },
  { id: "instagram", name: "Instagram Reels", color: "border-pink-500/40 text-pink-400 bg-pink-500/10", icon: "📸" },
  { id: "facebook", name: "Facebook Watch", color: "border-blue-500/40 text-blue-400 bg-blue-500/10", icon: "📘" },
  { id: "tiktok", name: "TikTok", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10", icon: "🎵" },
  { id: "twitter", name: "Twitter / X", color: "border-slate-500/40 text-slate-300 bg-slate-500/10", icon: "𝕏" },
  { id: "reddit", name: "Reddit", color: "border-orange-500/40 text-orange-400 bg-orange-500/10", icon: "🤖" },
  { id: "vimeo", name: "Vimeo", color: "border-teal-500/40 text-teal-400 bg-teal-500/10", icon: "🌐" },
];

const MAX_FILE_SIZE_MB = 500;
const ALLOWED_EXTENSIONS = ["mp4", "mov", "webm", "mkv"];

export function LectureInputSuite() {
  const router = useRouter();

  // Mode tab state
  const [activeTab, setActiveTab] = useState<"link" | "upload">("link");
  const [examCategory, setExamCategory] = useState("JEE Main & Advanced");

  // Universal Video Link state
  const [videoUrl, setVideoUrl] = useState("");
  const detected = detectPlatform(videoUrl);

  // File Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing State
  const [status, setStatus] = useState<"idle" | "detecting" | "downloading" | "transcribing" | "generating">("idle");
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Universal Video Link Form Submit
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setErrorMsg("Please paste a video link from YouTube, Instagram, Facebook, TikTok, or Vimeo.");
      return;
    }

    setStatus("detecting");
    setProgressPercent(20);
    setErrorMsg("");

    try {
      setTimeout(() => {
        setStatus("downloading");
        setProgressPercent(45);
      }, 1000);

      setTimeout(() => {
        setStatus("transcribing");
        setProgressPercent(75);
      }, 2200);

      setTimeout(() => {
        setStatus("generating");
        setProgressPercent(90);
      }, 3400);

      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, examCategory }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract video content.");
      }

      setProgressPercent(100);
      router.push(`/notes/${data.noteId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during video processing.");
      setStatus("idle");
      setProgressPercent(0);
    }
  };

  // File Upload Validation & Submit
  const validateAndSetFile = (file: File) => {
    setErrorMsg("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMsg("Unsupported file format. Please upload MP4, MOV, WebM, or MKV.");
      return;
    }
    if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      setErrorMsg(`File size exceeds 500MB limit.`);
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setStatus("downloading");
    setProgressPercent(25);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("examCategory", examCategory);

      setTimeout(() => setStatus("transcribing"), 1200);
      setTimeout(() => setStatus("generating"), 2500);

      const response = await fetch("/api/process-uploaded-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process video file.");

      setProgressPercent(100);
      router.push(`/notes/${data.noteId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Upload processing error.");
      setStatus("idle");
      setProgressPercent(0);
    }
  };

  const isProcessing = status !== "idle";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <Tabs defaultValue="link" value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
        <div className="flex justify-center mb-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="link" className="gap-2 text-xs sm:text-sm">
              <Globe className="h-4 w-4 text-emerald-400" />
              Paste Video Link
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2 text-xs sm:text-sm">
              <UploadCloud className="h-4 w-4 text-cyan-400" />
              Upload Video File
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Universal Video Link */}
        <TabsContent value="link" className="space-y-4">
          <form
            onSubmit={handleLinkSubmit}
            className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl transition-all focus-within:border-emerald-500/80 space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-emerald-400" />
                </div>
                <Input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube, Instagram, Facebook, TikTok, Twitter or any video link..."
                  className="pl-12 pr-4 h-14 bg-slate-950/90 text-white placeholder:text-slate-500 rounded-xl border-slate-800 text-xs sm:text-sm"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={examCategory}
                  onChange={(e) => setExamCategory(e.target.value)}
                  disabled={isProcessing}
                  className="h-14 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="JEE Main & Advanced">🎯 JEE Main / Adv</option>
                  <option value="NEET">🩺 NEET UG</option>
                  <option value="CBSE Boards">📚 Class 11/12 Boards</option>
                </select>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isProcessing}
                  className="h-14 px-6 gap-2 rounded-xl text-base whitespace-nowrap shadow-lg shadow-emerald-500/20"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
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

            {/* Platform Auto-Detection Pill */}
            {videoUrl && (
              <div className="flex items-center gap-2 px-2 text-xs font-semibold">
                <span className="text-slate-400">Detected Platform:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {detected.platformName}
                </span>
              </div>
            )}
          </form>

          {/* Platform Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium mr-1">Supported Platforms:</span>
            {SUPPORTED_PLATFORMS.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-transform hover:scale-105 ${p.color}`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Upload Video File */}
        <TabsContent value="upload">
          <form
            onSubmit={handleUploadSubmit}
            className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4"
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging ? "border-emerald-400 bg-emerald-500/10" : selectedFile ? "border-cyan-500/60 bg-slate-950/80" : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,.webm,.mkv"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                className="hidden"
                disabled={isProcessing}
              />
              {selectedFile ? (
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl">
                  <FileVideo className="h-8 w-8 text-cyan-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-white">Drag & Drop video file here or <span className="text-cyan-400 underline">Browse</span> (MP4, MOV, WebM, MKV up to 500MB)</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Target Exam:</span>
                <select
                  value={examCategory}
                  onChange={(e) => setExamCategory(e.target.value)}
                  disabled={isProcessing}
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <option value="JEE Main & Advanced">🎯 JEE Main / Adv</option>
                  <option value="NEET">🩺 NEET UG</option>
                  <option value="CBSE Boards">📚 Class 11/12 Boards</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="gradient"
                disabled={!selectedFile || isProcessing}
                className="w-full sm:w-auto h-12 px-6 gap-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20"
              >
                Upload & Extract AI Notes
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>

      {/* Progress Bar & Status Message */}
      {isProcessing && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="text-emerald-400 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {status === "detecting" && "Stage 1/4: Detecting platform & video metadata..."}
              {status === "downloading" && "Stage 2/4: Extracting audio stream via yt-dlp..."}
              {status === "transcribing" && "Stage 3/4: Transcribing speech with Whisper AI..."}
              {status === "generating" && "Stage 4/4: Synthesizing AI notes, LaTeX & quizzes..."}
            </span>
            <span className="text-white font-mono">{progressPercent}%</span>
          </div>

          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Error Message Display */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-400 flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
