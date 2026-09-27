"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NoteItem } from "@/lib/supabase";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ExportPdfButton } from "./ExportPdfButton";
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Share2, 
  CheckCircle2, 
  Tv, 
  Sigma, 
  MessageSquareQuote, 
  ExternalLink 
} from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface NoteViewerProps {
  note: NoteItem;
}

export function NoteViewer({ note }: NoteViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Basic LaTeX math renderer helper for equations in markdown text
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    
    // Split by block math $$...$$ and inline math $...$
    const paragraphs = content.split('\n\n');

    return (
      <div className="space-y-4 text-slate-200 leading-relaxed text-sm sm:text-base">
        {paragraphs.map((p, idx) => {
          if (p.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                {p.replace('### ', '')}
              </h3>
            );
          }
          if (p.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-8 mb-3">
                {p.replace('## ', '')}
              </h2>
            );
          }
          if (p.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl sm:text-3xl font-black text-white mt-4 mb-4">
                {p.replace('# ', '')}
              </h1>
            );
          }
          if (p.includes('$$')) {
            const mathParts = p.split('$$');
            return (
              <div key={idx} className="my-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 overflow-x-auto text-center shadow-inner">
                {mathParts.map((part, mIdx) => {
                  if (mIdx % 2 === 1) {
                    return <BlockMath key={mIdx} math={part} />;
                  }
                  return <span key={mIdx}>{part}</span>;
                })}
              </div>
            );
          }

          // Inline math check $...$
          if (p.includes('$')) {
            const inlineParts = p.split('$');
            return (
              <p key={idx} className="leading-relaxed">
                {inlineParts.map((part, iIdx) => {
                  if (iIdx % 2 === 1) {
                    return <InlineMath key={iIdx} math={part} />;
                  }
                  return <span key={iIdx}>{part}</span>;
                })}
              </p>
            );
          }

          return <p key={idx} className="leading-relaxed text-slate-300">{p}</p>;
        })}
      </div>
    );
  };

  return (
    <div id="printable-note-area" className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <Card className="border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 overflow-hidden shadow-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={note.subject.toLowerCase() as any} className="text-xs px-3 py-1">
                {note.subject}
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 border-emerald-500/40 text-emerald-400">
                🎯 {note.exam_category}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs">
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copied Link" : "Share"}
              </Button>
              <ExportPdfButton targetId="printable-note-area" filename={`${note.title}.pdf`} />
              <Link href={`/quiz/${note.id}`}>
                <Button variant="gradient" size="sm" className="gap-1.5 text-xs shadow-emerald-500/20">
                  <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
                  Take AI Quiz & Flashcards
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {note.title}
            </h1>
            {note.channel_name && (
              <p className="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                <Tv className="h-4 w-4 text-emerald-400" />
                Lecture by <span className="text-slate-200">{note.channel_name}</span>
              </p>
            )}
          </div>

          {/* Key Summary */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-300 space-y-1">
            <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wider block">
              💡 Executive Summary
            </span>
            <p>{note.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs View */}
      <Tabs defaultValue="board">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="board" className="gap-1.5 text-xs sm:text-sm">
              <Tv className="h-4 w-4 text-cyan-400" />
              Board Extract
            </TabsTrigger>
            <TabsTrigger value="full" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Full Notes
            </TabsTrigger>
            <TabsTrigger value="formulas" className="gap-1.5 text-xs sm:text-sm">
              <Sigma className="h-4 w-4 text-indigo-400" />
              Formulas
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Board Extract Tab */}
        <TabsContent value="board" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Teacher wrote on board */}
            <Card className="border-cyan-500/30 bg-slate-900/80 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Tv className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Blackboard / Whiteboard Writing</h3>
                    <p className="text-xs text-slate-400">AI visual OCR extraction of diagrams & formulas</p>
                  </div>
                </div>
                {renderFormattedContent(note.board_extract)}
              </CardContent>
            </Card>

            {/* What Teacher said vocally */}
            <Card className="border-amber-500/30 bg-slate-900/80 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Spoken Tips & Exam Gotchas</h3>
                    <p className="text-xs text-slate-400">Important verbal tricks & common student mistakes</p>
                  </div>
                </div>
                {renderFormattedContent(note.spoken_extract)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Full Study Notes Tab */}
        <TabsContent value="full">
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
            <CardContent className="p-6 sm:p-10 space-y-6">
              {renderFormattedContent(note.full_markdown)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Key Formulas Tab */}
        <TabsContent value="formulas">
          <Card className="border-indigo-500/30 bg-slate-900/90">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Sigma className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Essential Formulas & Equations</h3>
                  <p className="text-xs text-slate-400">Quick formula cheat sheet for rapid revision before exams</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {note.key_formulas?.map((formula, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="text-xs text-slate-500 font-mono self-start mb-2">Equation #{idx + 1}</span>
                    <div className="py-2 text-emerald-300 font-semibold text-lg overflow-x-auto max-w-full">
                      <BlockMath math={formula} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
