"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SAMPLE_NOTES, NoteItem } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Plus, 
  Layers, 
  Award, 
  Trash2, 
  Calendar 
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [notes, setNotes] = useState<NoteItem[]>(SAMPLE_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            My Study Dashboard 📚
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your saved YouTube lecture notes, formulas, and AI quizzes.
          </p>
        </div>

        <Link href="/">
          <Button variant="gradient" className="gap-2 shadow-emerald-500/20">
            <Plus className="h-4 w-4 stroke-[3]" />
            New Lecture Note
          </Button>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white">{notes.length}</span>
              <p className="text-xs text-slate-400 font-medium">Saved Lecture Notes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white">
                {notes.reduce((acc, n) => acc + (n.key_formulas?.length || 0), 0)}
              </span>
              <p className="text-xs text-slate-400 font-medium">Extracted Formulas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white">4</span>
              <p className="text-xs text-slate-400 font-medium">Quizzes Solved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search notes or formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-slate-900 border-slate-800"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {["All", "Physics", "Chemistry", "Mathematics", "Biology"].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubject === subj
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <CardContent className="space-y-3">
            <BookOpen className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Notes Found</h3>
            <p className="text-xs text-slate-400">
              Try tweaking your search term or subject filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="border-slate-800 bg-slate-900/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={note.subject.toLowerCase() as any}>
                    {note.subject}
                  </Badge>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    {formatDate(note.created_at)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {note.summary}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{note.key_formulas?.length || 0} Formulas Extracted</span>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>

              <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                <Link href={`/notes/${note.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Read Note
                  </Button>
                </Link>
                <Link href={`/quiz/${note.id}`} className="w-full">
                  <Button variant="gradient" size="sm" className="w-full text-xs gap-1">
                    <Sparkles className="h-3 w-3" /> Quiz
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
