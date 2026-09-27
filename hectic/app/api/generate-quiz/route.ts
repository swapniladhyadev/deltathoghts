import { NextResponse } from "next/server";
import { generateAIQuiz } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { notesContent } = await req.json();

    if (!notesContent) {
      return NextResponse.json({ error: "Notes content is required." }, { status: 400 });
    }

    const quizResult = await generateAIQuiz(notesContent);
    return NextResponse.json(quizResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate quiz." }, { status: 500 });
  }
}
