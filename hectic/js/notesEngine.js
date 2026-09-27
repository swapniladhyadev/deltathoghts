/* ==========================================================================
   BoardNotes AI - Notes Rendering & Memory-Safe KaTeX Engine
   ========================================================================== */

window.NotesEngine = {
  delegatedListenerAttached: false,

  /**
   * Render structured Markdown notes with memory cleanup
   */
  renderNotes(presetData, targetContainerId = "notes-content-area") {
    const container = document.getElementById(targetContainerId);
    if (!container || !presetData) return;

    // 1. Explicit DOM Node Memory Cleanup before injecting new content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 2. Build Formula Box Header HTML
    let summaryHtml = "";
    if (presetData.summaryFormulas && presetData.summaryFormulas.length > 0) {
      const cards = presetData.summaryFormulas.map(item => `
        <div class="formula-card">
          <div class="formula-math">$$\\mathbf{${item.formula}}$$</div>
          <div class="formula-label">${item.label}</div>
        </div>
      `).join('');

      summaryHtml = `
        <div class="summary-formula-box">
          <h4 style="color:var(--accent-primary); font-size:0.95rem; margin-bottom:0.6rem;">⚡ Must-Know Formulas & Key Equations</h4>
          <div class="formula-grid">
            ${cards}
          </div>
        </div>
      `;
    }

    // 3. Parse Markdown to HTML
    let htmlContent = this.parseMarkdown(presetData.notesMarkdown || "");

    // 4. Inject Content
    container.innerHTML = summaryHtml + htmlContent;

    // 5. Trigger KaTeX rendering safely
    this.renderKaTeX(container);

    // 6. Bind Timestamp Links using Memory-Safe Event Delegation
    this.bindTimestampDelegation(container);
  },

  /**
   * Markdown parser with timestamp badge creation
   */
  parseMarkdown(md) {
    if (!md) return "";

    let html = md;

    // Replace Timestamps [MM:SS] or [HH:MM:SS] with button spans
    html = html.replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g, (match, p1) => {
      const seconds = window.YouTubeEngine ? window.YouTubeEngine.timestampToSeconds(p1) : 0;
      return `<button class="timestamp-link" data-seconds="${seconds}">▶ ${p1}</button>`;
    });

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.1rem; margin:1rem 0 0.5rem 0;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.3rem; margin:1.2rem 0 0.6rem 0; border-bottom:1px solid var(--border-color); padding-bottom:0.3rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:1.5rem; margin:1.4rem 0 0.75rem 0;">$1</h1>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr style="margin:1rem 0; border:none; border-top:1px solid var(--border-color);">');

    // Formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');

    return html;
  },

  /**
   * Safe KaTeX render execution with error boundary
   */
  renderKaTeX(element) {
    if (!element) return;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("NotesEngine: KaTeX non-fatal render warning", err);
      }
    }
  },

  /**
   * Memory-Safe Event Delegation for Timestamps (Prevents Event Listener Memory Leak)
   */
  bindTimestampDelegation(container) {
    if (container.getAttribute('data-delegated') === 'true') return;

    container.setAttribute('data-delegated', 'true');
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.timestamp-link');
      if (btn) {
        e.preventDefault();
        const secondsStr = btn.getAttribute('data-seconds');
        const seconds = parseInt(secondsStr, 10);
        if (!isNaN(seconds) && window.YouTubeEngine) {
          window.YouTubeEngine.seekTo(seconds);
        }
      }
    });
  }
};
