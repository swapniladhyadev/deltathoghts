import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "physics" | "chemistry" | "maths" | "biology";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700",
    outline: "text-slate-300 border border-slate-700",
    physics: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    chemistry: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    maths: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
    biology: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  );
}

export { Badge };
