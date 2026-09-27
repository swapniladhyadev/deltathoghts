import React from "react";
import { Card, CardContent } from "./ui/card";
import { Sparkles } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-8">
      <Card className="border-slate-800 bg-slate-900/80 animate-pulse">
        <CardContent className="p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400 animate-spin" />
            <span className="text-sm font-semibold text-emerald-400">
              BoardNotes AI is extracting blackboard formulas & spoken lecture notes...
            </span>
          </div>
          <div className="h-8 bg-slate-800 rounded-xl w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded-lg w-1/2"></div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800/60 p-4 space-y-2">
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
              <div className="h-3 bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-800 rounded w-2/3"></div>
            </div>
            <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800/60 p-4 space-y-2">
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
              <div className="h-3 bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-800 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
