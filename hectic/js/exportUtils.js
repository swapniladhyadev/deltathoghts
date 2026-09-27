/* ==========================================================================
   BoardNotes AI - Export & Utilities Manager
   PDF Print Formatting, Markdown File Download, & Clipboard Copy
   ========================================================================== */

window.ExportUtils = {

  /**
   * Export current lecture notes as downloadable Markdown (.md) file
   */
  downloadMarkdown(presetData) {
    if (!presetData) return;

    const filename = `${presetData.title.replace(/[^a-zA-Z0-9]/g, '_')}_BoardNotes.md`;
    const header = `---
title: "${presetData.title}"
subject: "${presetData.subject}"
exam: "${presetData.exam}"
youtube_url: "${presetData.youtubeUrl}"
generated_by: "BoardNotes AI"
date: "${new Date().toLocaleDateString()}"
---\n\n`;

    const content = header + (presetData.notesMarkdown || "");

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Copy Markdown / Text to Clipboard with visual feedback button indicator
   */
  copyToClipboard(presetData, triggerButton) {
    if (!presetData) return;

    const text = presetData.notesMarkdown || "";
    navigator.clipboard.writeText(text).then(() => {
      if (triggerButton) {
        const origText = triggerButton.innerHTML;
        triggerButton.innerHTML = "✅ Copied!";
        setTimeout(() => { triggerButton.innerHTML = origText; }, 2000);
      }
    }).catch(err => {
      console.error("Failed to copy to clipboard", err);
    });
  },

  /**
   * Format & Trigger Browser Print to PDF
   */
  exportPDF() {
    window.print();
  }
};
