import { NextResponse } from "next/server";
import { generateAINotes } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { title, transcript, examCategory } = await req.json();

    if (!title || !transcript) {
      return NextResponse.json({ error: "Title and transcript are required." }, { status: 400 });
    }

    const result = await generateAINotes(title, transcript, examCategory);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate notes." }, { status: 500 });
  }
}
