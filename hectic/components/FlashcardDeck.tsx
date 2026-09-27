"use client";

import React, { useState } from "react";
import { Flashcard } from "@/lib/supabase";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, RotateCw, Sparkles, Layers } from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        No flashcards generated yet for this note.
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-medium">
        <span className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          Card {currentIndex + 1} of {cards.length}
        </span>
        <span>Click card to flip 🔄</span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer perspective-1000 min-h-[280px] w-full"
      >
        <Card
          className={`h-full w-full transition-transform duration-500 transform-style-3d border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl flex flex-col justify-center items-center p-8 text-center border-2 ${
            isFlipped ? "border-cyan-500/50" : "border-emerald-500/50"
          }`}
        >
          <CardContent className="space-y-4">
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block">
                  Question / Concept
                </span>
                <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  {currentCard.front}
                </p>
                <p className="text-xs text-slate-500 pt-2 flex items-center justify-center gap-1">
                  <RotateCw className="h-3 w-3" /> Tap to reveal answer & formula
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400 block">
                  Answer & Key Formula
                </span>
                <p className="text-lg font-semibold text-slate-200">
                  {currentCard.back}
                </p>

                {currentCard.formula && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-emerald-300">
                    <BlockMath math={currentCard.formula} />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setIsFlipped(!isFlipped)} className="gap-1 text-slate-300">
          <RotateCw className="h-4 w-4 text-emerald-400" /> Flip Card
        </Button>

        <Button variant="outline" size="sm" onClick={handleNext} className="gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
