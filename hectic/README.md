# BoardNotes AI 🎓🚀

> **AI-Powered YouTube Lecture Note Generator & Study Suite for JEE, NEET, & Board Students.**

BoardNotes AI extracts both **what the teacher writes on the blackboard/whiteboard** (visual OCR synthesis) and **what the teacher explains vocally**, synthesizing them into beautifully formatted study notes with LaTeX math equations, formula summaries, interactive quizzes, practice tests, and 3D flashcards.

---

## ✨ Features

- 📹 **YouTube Lecture to AI Notes**: Paste any YouTube lecture URL (Physics, Chemistry, Maths, Biology, etc.).
- 🖋️ **Board Content & Spoken Content Extraction**: Captures key definitions, diagrams described, and board steps.
- 📐 **Full LaTeX Math Support**: Render complex integrals, vectors, chemical equations, and formulas via KaTeX.
- 🧠 **Instant Quiz & Flashcard Generation**: Generate 5-10 JEE/NEET style MCQs + 3D memory flashcards from generated notes.
- 📄 **One-Click PDF Export**: Download complete study notes formatted for printing or offline revision.
- 🔐 **Supabase Authentication**: Save notes to your personal dashboard with Google OAuth login.
- 📱 **100% Mobile Responsive**: Clean dark UI with neon glassmorphism tailored for student workflows.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14/15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism UI
- **Database & Auth**: Supabase (PostgreSQL + RLS + Google OAuth)
- **AI Engine**: OpenAI API (`gpt-4o` / `gpt-4o-mini`)
- **Math Rendering**: KaTeX + `react-katex`
- **PDF Export**: `html2canvas` + `jspdf`

---

## 🚀 Quick Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-proj-your-openai-api-key
```

### 3. Setup Supabase Database
Execute the SQL script in `schema.sql` inside your Supabase project's SQL Editor to create the required tables and RLS security policies.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Database Schema Overview

- `profiles`: Stores student profiles, target exam (JEE Main, NEET, Boards).
- `notes`: Stores YouTube video details, board extracts, spoken extracts, formulas, and formatted markdown notes.
- `quizzes`: Stores generated JSON MCQs and 3D flashcards.
- `quiz_attempts`: Tracks student quiz scores and time taken.
