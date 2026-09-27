"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SAMPLE_QUIZZES, SAMPLE_NOTES, QuizQuestion, Flashcard } from "@/lib/supabase";
import { QuizInterface } from "@/components/QuizInterface";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, BrainCircuit, Layers } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const noteId = params.id as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [noteTitle, setNoteTitle] = useState("Study Lecture");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt sample quiz match
    const sampleQuiz = SAMPLE_QUIZZES[noteId] || SAMPLE_QUIZZES['sample-jee-physics-01'];
    const sampleNote = SAMPLE_NOTES.find((n) => n.id === noteId) || SAMPLE_NOTES[0];

    setQuestions(sampleQuiz.questions);
    setFlashcards(sampleQuiz.flashcards);
    setNoteTitle(sampleNote.title);
    setLoading(false);
  }, [noteId]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href={`/notes/${noteId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Notes
          </Button>
        </Link>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 fill-emerald-400" />
          AI Practice Suite
        </span>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Practice & Test Yourself
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          {noteTitle}
        </p>
      </div>

      {/* Tabs for Quiz vs Flashcard Deck */}
      <Tabs defaultValue="quiz">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-sm">
            <TabsTrigger value="quiz" className="gap-2">
              <BrainCircuit className="h-4 w-4 text-emerald-400" />
              MCQ Quiz ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Flashcards ({flashcards.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="quiz">
          <QuizInterface questions={questions} noteTitle={noteTitle} />
        </TabsContent>

        <TabsContent value="flashcards">
          <FlashcardDeck cards={flashcards} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
