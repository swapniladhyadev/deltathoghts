"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface ExportPdfButtonProps {
  targetId: string;
  filename?: string;
}

export function ExportPdfButton({ targetId, filename = "BoardNotes_Study_Note.pdf" }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      // Dynamic import of html2canvas and jspdf to keep bundle light
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById(targetId);
      if (!element) {
        throw new Error("Target element for PDF print not found.");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020617",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (err) {
      console.error("PDF Export error:", err);
      window.print(); // Fallback to native browser print dialog
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportPdf}
      disabled={isExporting}
      className="gap-1.5 text-xs border-slate-700 hover:border-emerald-500/50"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5 text-emerald-400" />
          Export PDF
        </>
      )}
    </Button>
  );
}
