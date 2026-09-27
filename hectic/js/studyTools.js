/* ==========================================================================
   BoardNotes AI - Study Tools Engine
   Memory-safe Quizzes, Timed Tests, 3D Flashcards, & PYQs
   ========================================================================== */

window.StudyToolsEngine = {
  currentPreset: null,
  
  // Flashcard State
  flashcardIndex: 0,
  flashcardFlipped: false,
  masteredCards: new Set(),

  // Timed Test State
  testActive: false,
  testTimeRemaining: 600,
  testTimerInterval: null,
  testAnswers: {},

  /**
   * Initialize Study Tools with memory cleanup
   */
  init(presetData) {
    this.cleanup(); // Cancel active timers and reset state
    this.currentPreset = presetData;
    this.renderQuiz();
    this.renderFlashcards();
    this.renderPYQs();
  },

  /**
   * Complete Memory & Timer Cleanup
   */
  cleanup() {
    if (this.testTimerInterval) {
      clearInterval(this.testTimerInterval);
      this.testTimerInterval = null;
    }
    this.testActive = false;
    this.testAnswers = {};
    this.masteredCards.clear();
    this.flashcardIndex = 0;
    this.flashcardFlipped = false;
  },

  /* ==========================================================================
     1. QUIZ ENGINE
     ========================================================================== */
  renderQuiz() {
    const container = document.getElementById("quiz-content-area");
    if (!container || !this.currentPreset || !this.currentPreset.quiz) return;

    while (container.firstChild) container.removeChild(container.firstChild);

    const quizList = this.currentPreset.quiz;
    let html = `
      <div class="quiz-container">
        <div class="notes-header-bar">
          <h3>🧠 Concept Check Quiz</h3>
          <span class="meta-tag tag-physics">${quizList.length} Questions</span>
        </div>
    `;

    quizList.forEach((q, qIndex) => {
      const optionsHtml = q.options.map((opt, optIndex) => `
        <div class="option-item" data-qindex="${qIndex}" data-optindex="${optIndex}">
          <span style="font-weight:700; color:var(--accent-primary);">${String.fromCharCode(65 + optIndex)}.</span>
          <span>${opt}</span>
        </div>
      `).join('');

      html += `
        <div class="quiz-card" id="quiz-card-${qIndex}">
          <div class="question-text">${qIndex + 1}. ${q.question.replace(/\n/g, '<br>')}</div>
          <div class="options-grid">${optionsHtml}</div>
          <div class="callout callout-remember" id="explanation-${qIndex}" style="display:none; margin-top:0.75rem;">
            <div class="callout-icon">💡</div>
            <div>
              <div style="font-weight:700; font-size:0.85rem;">Explanation:</div>
              <div style="font-size:0.85rem;">${q.explanation}</div>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    if (window.NotesEngine) window.NotesEngine.renderKaTeX(container);

    // Single delegated click listener to prevent event listener accumulation
    container.addEventListener('click', (e) => {
      const optionEl = e.target.closest('.option-item');
      if (optionEl) {
        const qIndex = parseInt(optionEl.getAttribute('data-qindex'), 10);
        const optIndex = parseInt(optionEl.getAttribute('data-optindex'), 10);
        this.handleQuizSelect(qIndex, optIndex);
      }
    });
  },

  handleQuizSelect(qIndex, selectedOptIndex) {
    const qData = this.currentPreset.quiz[qIndex];
    const cardEl = document.getElementById(`quiz-card-${qIndex}`);
    if (!cardEl || !qData) return;

    const options = cardEl.querySelectorAll('.option-item');
    options.forEach((optEl, i) => {
      optEl.classList.remove('selected', 'correct', 'wrong');
      if (i === qData.correctIndex) {
        optEl.classList.add('correct');
      } else if (i === selectedOptIndex) {
        optEl.classList.add('wrong');
      }
    });

    const expEl = document.getElementById(`explanation-${qIndex}`);
    if (expEl) expEl.style.display = 'flex';
  },

  /* ==========================================================================
     2. 3D FLASHCARDS ENGINE
     ========================================================================== */
  renderFlashcards() {
    const container = document.getElementById("flashcards-content-area");
    if (!container || !this.currentPreset || !this.currentPreset.flashcards) return;
    this.updateFlashcardView(container);
  },

  updateFlashcardView(container = document.getElementById("flashcards-content-area")) {
    const cards = this.currentPreset.flashcards;
    if (!cards || cards.length === 0) return;

    const currentCard = cards[this.flashcardIndex];

    const html = `
      <div class="flashcards-container">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
          <span class="meta-tag">Card ${this.flashcardIndex + 1} of ${cards.length}</span>
          <span class="meta-tag tag-chemistry">Mastered: ${this.masteredCards.size}/${cards.length}</span>
        </div>

        <div class="card-flip-wrapper ${this.flashcardFlipped ? 'flipped' : ''}" id="flashcard-element">
          <div class="card-flip-inner">
            <div class="card-face card-face-front">
              <div style="font-size: clamp(0.95rem, 3vw, 1.15rem); font-weight: 600;">${currentCard.front}</div>
              <div style="position:absolute; bottom:0.75rem; font-size:0.72rem; color:var(--text-muted);">💡 Tap card to flip answer</div>
            </div>
            <div class="card-face card-face-back">
              <div style="font-size: clamp(1rem, 3.2vw, 1.25rem); font-weight: 700; color: var(--accent-primary);">${currentCard.back}</div>
              <div style="position:absolute; bottom:0.75rem; font-size:0.72rem; color:var(--text-muted);">🔄 Tap card to flip back</div>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:0.6rem; width:100%; justify-content:center;">
          <button class="btn btn-secondary btn-sm" id="fc-prev-btn" ${this.flashcardIndex === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="btn btn-primary btn-sm" id="fc-master-btn">
            ${this.masteredCards.has(this.flashcardIndex) ? '✅ Mastered' : '⭐ Master'}
          </button>
          <button class="btn btn-secondary btn-sm" id="fc-next-btn" ${this.flashcardIndex === cards.length - 1 ? 'disabled' : ''}>Next →</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.NotesEngine) window.NotesEngine.renderKaTeX(container);

    const cardEl = document.getElementById("flashcard-element");
    if (cardEl) {
      cardEl.addEventListener('click', () => {
        this.flashcardFlipped = !this.flashcardFlipped;
        cardEl.classList.toggle('flipped', this.flashcardFlipped);
      });
    }

    document.getElementById("fc-prev-btn")?.addEventListener('click', () => {
      if (this.flashcardIndex > 0) {
        this.flashcardIndex--;
        this.flashcardFlipped = false;
        this.updateFlashcardView(container);
      }
    });

    document.getElementById("fc-next-btn")?.addEventListener('click', () => {
      if (this.flashcardIndex < cards.length - 1) {
        this.flashcardIndex++;
        this.flashcardFlipped = false;
        this.updateFlashcardView(container);
      }
    });

    document.getElementById("fc-master-btn")?.addEventListener('click', () => {
      if (this.masteredCards.has(this.flashcardIndex)) {
        this.masteredCards.delete(this.flashcardIndex);
      } else {
        this.masteredCards.add(this.flashcardIndex);
      }
      this.updateFlashcardView(container);
    });
  },

  /* ==========================================================================
     3. PYQ ENGINE
     ========================================================================== */
  renderPYQs() {
    const container = document.getElementById("pyq-content-area");
    if (!container || !this.currentPreset || !this.currentPreset.pyqs) return;

    const pyqList = this.currentPreset.pyqs;
    let html = `
      <div class="pyq-container">
        <div class="notes-header-bar">
          <h3>🎯 Target Exam Past Year Questions (PYQs)</h3>
          <span class="meta-tag tag-maths">${pyqList.length} PYQs</span>
        </div>
    `;

    pyqList.forEach((pyq, index) => {
      html += `
        <div class="quiz-card">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; align-items:center;">
            <span class="meta-tag tag-physics" style="font-weight:700;">${pyq.examTag}</span>
            <button class="btn btn-secondary btn-sm pyq-sol-btn" data-pyqindex="${index}">Show Solution 💡</button>
          </div>
          <div class="question-text">${pyq.question.replace(/\n/g, '<br>')}</div>
          <div class="callout callout-remember" id="pyq-sol-${index}" style="display:none; margin-top:0.75rem;">
            <div class="callout-icon">📝</div>
            <div>
              <div style="font-weight:700; font-size:0.85rem;">Step-by-Step Solution:</div>
              <div style="font-size:0.85rem;">${pyq.solution.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    if (window.NotesEngine) window.NotesEngine.renderKaTeX(container);

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.pyq-sol-btn');
      if (btn) {
        const index = btn.getAttribute('data-pyqindex');
        const solEl = document.getElementById(`pyq-sol-${index}`);
        if (solEl) {
          const isHidden = solEl.style.display === 'none';
          solEl.style.display = isHidden ? 'flex' : 'none';
          btn.innerText = isHidden ? 'Hide Solution 🙈' : 'Show Solution 💡';
        }
      }
    });
  },

  /* ==========================================================================
     4. TIMED MOCK TEST MODE ENGINE WITH SAFE INTERVAL CLEANUP
     ========================================================================== */
  startMockTest() {
    if (!this.currentPreset || !this.currentPreset.quiz) return;

    this.cleanup(); // Stop any pre-existing timer interval!

    this.testActive = true;
    this.testTimeRemaining = 600;
    this.testAnswers = {};

    const container = document.getElementById("test-content-area");
    if (!container) return;

    this.renderTestUI(container);
    this.startTestTimer();
  },

  renderTestUI(container) {
    const questions = this.currentPreset.quiz;

    let html = `
      <div class="test-header-bar">
        <div>
          <span style="font-weight:700;">⏱️ Timed Mock Test</span>
          <span class="meta-tag tag-chemistry" style="margin-left:0.4rem;">+4 / -1</span>
        </div>
        <div class="timer-badge" id="test-timer-display">10:00</div>
        <button class="btn btn-primary btn-sm" id="submit-test-btn">Submit Test 🚀</button>
      </div>

      <div class="test-questions-list">
    `;

    questions.forEach((q, qIndex) => {
      const optionsHtml = q.options.map((opt, optIndex) => `
        <label class="option-item" style="cursor:pointer;">
          <input type="radio" name="test-q-${qIndex}" value="${optIndex}" style="accent-color: var(--accent-primary);">
          <span>${opt}</span>
        </label>
      `).join('');

      html += `
        <div class="quiz-card">
          <div class="question-text">Q${qIndex + 1}: ${q.question.replace(/\n/g, '<br>')}</div>
          <div class="options-grid">${optionsHtml}</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    if (window.NotesEngine) window.NotesEngine.renderKaTeX(container);

    questions.forEach((q, qIndex) => {
      const radios = container.querySelectorAll(`input[name="test-q-${qIndex}"]`);
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.testAnswers[qIndex] = parseInt(e.target.value, 10);
        });
      });
    });

    document.getElementById("submit-test-btn")?.addEventListener('click', () => {
      this.submitTest();
    });
  },

  startTestTimer() {
    if (this.testTimerInterval) clearInterval(this.testTimerInterval);

    this.testTimerInterval = setInterval(() => {
      this.testTimeRemaining--;

      const display = document.getElementById("test-timer-display");
      if (display) {
        const mins = Math.floor(this.testTimeRemaining / 60);
        const secs = this.testTimeRemaining % 60;
        display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }

      if (this.testTimeRemaining <= 0) {
        if (this.testTimerInterval) clearInterval(this.testTimerInterval);
        this.testTimerInterval = null;
        alert("⏰ Time is up! Submitting test...");
        this.submitTest();
      }
    }, 1000);
  },

  submitTest() {
    if (this.testTimerInterval) {
      clearInterval(this.testTimerInterval);
      this.testTimerInterval = null;
    }
    this.testActive = false;

    const questions = this.currentPreset.quiz;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    questions.forEach((q, qIndex) => {
      const selected = this.testAnswers[qIndex];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctIndex) {
        score += 4;
        correctCount++;
      } else {
        score -= 1;
        wrongCount++;
      }
    });

    const maxScore = questions.length * 4;
    const percentage = Math.round((score / maxScore) * 100);

    const container = document.getElementById("test-content-area");
    if (!container) return;

    container.innerHTML = `
      <div class="summary-formula-box" style="text-align:center; padding:1.5rem;">
        <h2>📊 Performance Report</h2>
        <div style="font-size:2.5rem; font-weight:800; color:var(--accent-primary); margin:0.75rem 0;">
          ${score} <span style="font-size:1.2rem; color:var(--text-secondary);">/ ${maxScore}</span>
        </div>
        <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
          <span class="meta-tag tag-chemistry">Correct (+4): ${correctCount}</span>
          <span class="meta-tag tag-physics" style="background:rgba(239,68,68,0.15); color:#f87171;">Wrong (-1): ${wrongCount}</span>
          <span class="meta-tag">Unattempted: ${unattempted}</span>
        </div>
        <p style="color:var(--text-secondary);">Accuracy Score: <strong>${percentage}%</strong></p>
        <button class="btn btn-primary" id="retake-test-btn" style="margin-top:1rem;">Retake Test 🔄</button>
      </div>
    `;

    document.getElementById("retake-test-btn")?.addEventListener('click', () => {
      this.startMockTest();
    });
  }
};
