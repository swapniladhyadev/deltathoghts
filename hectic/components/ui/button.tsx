import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "gradient" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 border border-emerald-500/30",
      gradient:
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-semibold hover:opacity-95 shadow-lg shadow-cyan-500/25 border border-emerald-400/30",
      outline:
        "border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white backdrop-blur-md",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/50",
      ghost:
        "hover:bg-slate-800/60 hover:text-white text-slate-300",
      destructive:
        "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/30",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-xl px-6 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
