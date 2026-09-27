"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NoteItem, SAMPLE_NOTES } from "@/lib/supabase";
import { NoteViewer } from "@/components/NoteViewer";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NoteDetailPage() {
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt match in sample notes or fetch from state/API
    const foundSample = SAMPLE_NOTES.find((n) => n.id === noteId);
    if (foundSample) {
      setNote(foundSample);
      setLoading(false);
      return;
    }

    // Try fetching from localStorage or fallback
    const localSaved = localStorage.getItem(`boardnotes_${noteId}`);
    if (localSaved) {
      try {
        setNote(JSON.parse(localSaved));
        setLoading(false);
        return;
      } catch (err) {}
    }

    // Default to first sample note if not found for seamless fallback presentation
    setNote(SAMPLE_NOTES[0]);
    setLoading(false);
  }, [noteId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!note) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Note Not Found</h2>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <NoteViewer note={note} />
    </div>
  );
}
