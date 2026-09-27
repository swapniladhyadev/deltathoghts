import { NextResponse } from "next/server";
import { extractUniversalVideoInfo } from "@/lib/ytdlp";
import { generateAINotes } from "@/lib/ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { videoUrl, examCategory } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "Video link is required." }, { status: 400 });
    }

    // 1. Universal metadata & transcript extraction using yt-dlp / OEmbed
    let videoInfo;
    try {
      videoInfo = await extractUniversalVideoInfo(videoUrl);
    } catch (ytdlpErr: any) {
      console.error("Universal video extraction error:", ytdlpErr);
      return NextResponse.json(
        { error: "Could not extract this video. The link may be private, restricted, or deleted." },
        { status: 422 }
      );
    }

    // 2. Synthesize AI notes with LaTeX equations & board extracts
    const aiNotes = await generateAINotes(
      videoInfo.title,
      videoInfo.extractedTranscript,
      examCategory || "JEE Main & Advanced"
    );

    const noteId = `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newNote = {
      id: noteId,
      video_url: videoUrl,
      video_id: noteId,
      title: videoInfo.title,
      channel_name: `${videoInfo.author} (${videoInfo.platformName})`,
      subject: aiNotes.subject,
      exam_category: aiNotes.examCategory,
      summary: aiNotes.summary,
      board_extract: aiNotes.boardExtract,
      spoken_extract: aiNotes.spokenExtract,
      key_formulas: aiNotes.keyFormulas,
      full_markdown: aiNotes.fullMarkdown,
      created_at: new Date().toISOString()
    };

    // 3. Database persistence attempt
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.includes("supabase.co")) {
        await supabase.from("notes").insert([newNote]);
      }
    } catch (dbErr) {
      console.warn("Supabase note insertion fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      noteId: newNote.id,
      note: newNote,
    });
  } catch (err: any) {
    console.error("process-video error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process video link." },
      { status: 500 }
    );
  }
}
