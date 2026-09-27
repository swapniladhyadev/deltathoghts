import React from "react";
import Link from "next/link";
import { GraduationCap, Heart, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white">BoardNotes AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Empowering Indian students preparing for JEE Main, JEE Advanced, NEET, and Board exams with AI visual board extraction & spoken lecture synthesis.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Built for Physics Wallah, Unacademy, Vedantu & Khan Academy YouTube lectures.
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Exams Covered</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-emerald-400 cursor-pointer">JEE Main Physics & Math</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">JEE Advanced Problem Solving</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">NEET Biology & Chemistry</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer">Class 11th & 12th CBSE Boards</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-emerald-400">Paste Lecture Link</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-400">My Dashboard</Link></li>
            <li><Link href="/#features" className="hover:text-emerald-400">Board Extract AI</Link></li>
            <li><Link href="/#sample-notes" className="hover:text-emerald-400">Practice Quizzes</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} BoardNotes AI. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Crafted with <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" /> for Indian Aspirants.
        </p>
      </div>
    </footer>
  );
}
