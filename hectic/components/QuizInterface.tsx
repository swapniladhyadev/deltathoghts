"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  noteTitle: string;
}

export function QuizInterface({ questions, noteTitle }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing after submitting
    setSelectedOption(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = index;
    setUserAnswers(newAnswers);

    if (index === currentQ.answerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(userAnswers[currentIndex + 1] ?? null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const renderMathText = (text: string) => {
    if (!text) return null;
    if (text.includes('$')) {
      const parts = text.split('$');
      return (
        <span>
          {parts.map((p, idx) => (idx % 2 === 1 ? <InlineMath key={idx} math={p} /> : <span key={idx}>{p}</span>))}
        </span>
      );
    }
    return <span>{text}</span>;
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card className="max-w-2xl mx-auto border-emerald-500/40 bg-slate-900/90 shadow-2xl text-center">
        <CardContent className="p-8 sm:p-12 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Award className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Quiz Complete! 🎉</h2>
            <p className="text-slate-400 text-sm">{noteTitle}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Your Score</span>
            <div className="text-4xl font-black text-white">
              {score} / {questions.length}
              <span className="text-lg text-emerald-400 font-semibold ml-2">({percentage}%)</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <p className="text-sm text-slate-300">
            {percentage >= 80
              ? "🌟 Excellent! You have mastered this lecture concept."
              : percentage >= 50
              ? "👍 Good attempt! Review the board formulas and try again."
              : "📖 Keep practicing! Re-read the lecture notes and attempt the quiz again."}
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">Score: {score}</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 mt-2" />
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {renderMathText(currentQ.question)}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.answerIndex;
            let optionStyle = "border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-200";

            if (selectedOption !== null) {
              if (isCorrect) {
                optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-300";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between text-sm sm:text-base transition-all ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{renderMathText(opt)}</span>
                </div>
                {selectedOption !== null && (
                  <div>
                    {isCorrect && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                    {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box when option is selected */}
        {selectedOption !== null && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm space-y-1">
            <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" /> Explanation:
            </span>
            <p className="text-slate-300">{renderMathText(currentQ.explanation)}</p>
          </div>
        )}

        {/* Footer Next Button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={selectedOption === null}
            className="gap-2"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "See Final Score"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
