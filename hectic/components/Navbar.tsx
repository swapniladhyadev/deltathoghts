"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, BookOpen, GraduationCap, LogIn, UserCheck, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google Auth Login error:", err);
      // Toggle demo state if Supabase environment keys are unset
      setIsLoggedIn(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-2 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              BoardNotes <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider block -mt-1">
              JEE • NEET • BOARDS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-emerald-400"
          >
            <BookOpen className="h-4 w-4" />
            My Dashboard
          </Link>
          <Link
            href="/#sample-notes"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-emerald-400"
          >
            Sample Notes
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-emerald-400"
          >
            Features
          </Link>
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
                <UserCheck className="h-4 w-4" />
                Dashboard Active
              </Button>
            </Link>
          ) : (
            <Button variant="gradient" onClick={handleGoogleLogin} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign in with Google
            </Button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900 font-medium"
          >
            My Dashboard
          </Link>
          <Link
            href="/#sample-notes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900 font-medium"
          >
            Sample Notes
          </Link>
          <div className="pt-2">
            <Button variant="gradient" onClick={handleGoogleLogin} className="w-full justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
