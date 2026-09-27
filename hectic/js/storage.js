/* ==========================================================================
   BoardNotes AI - Storage & Memory Leak Protection Engine
   Guarantees safe LocalStorage limits, pruning, and error recovery
   ========================================================================== */

window.StorageEngine = {
  STORAGE_KEY_NOTES: "boardnotes_user_saved_notes",
  STORAGE_KEY_STATS: "boardnotes_user_stats",
  MAX_SAVED_NOTES: 10, // Cap to prevent LocalStorage quota overflow & memory crashes

  /**
   * Safe read from LocalStorage with fallback
   */
  getSavedNotes() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_NOTES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("StorageEngine: Corrupted data found in localStorage. Resetting notes array.", e);
      return [];
    }
  },

  /**
   * Safe save note with automatic pruning & QuotaExceeded error recovery
   */
  saveNote(noteData) {
    if (!noteData || !noteData.id) return false;

    try {
      let saved = this.getSavedNotes();

      // Trim heavy elements if any
      const compactNote = {
        id: noteData.id,
        title: noteData.title || "Untitled Lecture",
        subject: noteData.subject || "physics",
        exam: noteData.exam || "JEE Main",
        language: noteData.language || "hinglish",
        youtubeUrl: noteData.youtubeUrl || "",
        youtubeId: noteData.youtubeId || "",
        duration: noteData.duration || "30:00",
        summaryFormulas: noteData.summaryFormulas || [],
        notesMarkdown: noteData.notesMarkdown || "",
        quiz: (noteData.quiz || []).slice(0, 5), // Cap max questions
        flashcards: (noteData.flashcards || []).slice(0, 8),
        pyqs: (noteData.pyqs || []).slice(0, 5),
        updatedAt: new Date().toISOString()
      };

      // Find if already saved
      const index = saved.findIndex(item => item.id === compactNote.id);
      if (index >= 0) {
        saved[index] = compactNote;
      } else {
        saved.unshift(compactNote);
      }

      // Enforce max items limit to prevent memory bloat
      if (saved.length > this.MAX_SAVED_NOTES) {
        saved = saved.slice(0, this.MAX_SAVED_NOTES);
      }

      localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(saved));
      this.updateStatsOnSave();
      return true;

    } catch (err) {
      console.error("StorageEngine: QuotaExceededError or Storage Failure", err);
      // Recovery attempt: Prune to 3 notes and retry
      try {
        let saved = this.getSavedNotes().slice(0, 3);
        localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(saved));
        alert("⚠️ Storage limit reached! Older notes were auto-pruned to keep the app fast.");
      } catch (retryErr) {
        console.error("StorageEngine: Fatal storage error", retryErr);
      }
      return false;
    }
  },

  /**
   * Delete a note by ID
   */
  deleteNote(id) {
    try {
      let saved = this.getSavedNotes();
      saved = saved.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(saved));
    } catch (e) {
      console.error("StorageEngine: Error deleting note", e);
    }
  },

  /**
   * User Stats with safe fallback
   */
  getUserStats() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_STATS);
      return data ? JSON.parse(data) : { streak: 5, notesGenerated: 12, questionsSolved: 38 };
    } catch (e) {
      return { streak: 5, notesGenerated: 12, questionsSolved: 38 };
    }
  },

  updateStatsOnSave() {
    try {
      const stats = this.getUserStats();
      stats.notesGenerated = (stats.notesGenerated || 0) + 1;
      localStorage.setItem(this.STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      // Ignore non-critical stats error
    }
  },

  /**
   * Complete App Reset & Storage Clear (Solves blank page / frozen app issues)
   */
  resetAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY_NOTES);
      localStorage.removeItem(this.STORAGE_KEY_STATS);
      localStorage.removeItem("boardnotes_theme");
      sessionStorage.clear();
      console.log("🧹 Storage reset successfully!");
      return true;
    } catch (e) {
      console.error("Error clearing storage", e);
      return false;
    }
  }
};
