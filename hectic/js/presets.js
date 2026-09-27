/* ==========================================================================
   BoardNotes AI - Pre-loaded Indian Lecture Presets Database
   Covers JEE Main/Advanced, NEET-UG, Class 11/12 Boards, CUET
   ========================================================================== */

window.LECTURE_PRESETS = [
  {
    id: "preset-physics-kinematics",
    title: "Complete Kinematics: 2D Projectile Motion & Derivations",
    channel: "Motion Education / NV Sir Physics",
    subject: "physics",
    exam: "JEE Advanced",
    language: "hinglish",
    youtubeUrl: "https://www.youtube.com/watch?v=kY3LtrX0UjU",
    youtubeId: "kY3LtrX0UjU",
    duration: "45:20",
    summaryFormulas: [
      { label: "Time of Flight (T)", formula: "T = \\frac{2u \\sin\\theta}{g}" },
      { label: "Maximum Height (H_max)", formula: "H_{\\max} = \\frac{u^2 \\sin^2\\theta}{2g}" },
      { label: "Horizontal Range (R)", formula: "R = \\frac{u^2 \\sin 2\\theta}{g}" },
      { label: "Equation of Trajectory", formula: "y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}" }
    ],
    notesMarkdown: `
# 🚀 2D Motion: Projectile Motion & Derivations

### 📌 Lecture Overview & Initial Conditions
When a particle is thrown near the earth's surface with an initial velocity $u$ at an angle $\\theta$ with the horizontal, it traces a parabolic path under constant acceleration due to gravity ($g$).

[01:15] **Decomposition into Independent 1D Motions:**
* **Horizontal Axis ($X$):**
  * Initial velocity: $u_x = u \\cos\\theta$
  * Acceleration: $a_x = 0$ (assuming negligible air resistance)
  * Displacement: $x = (u \\cos\\theta) \\cdot t$

* **Vertical Axis ($Y$):**
  * Initial velocity: $u_y = u \\sin\\theta$
  * Acceleration: $a_y = -g$
  * Velocity at time $t$: $v_y = u \\sin\\theta - gt$

---

### 📐 Step-by-Step Derivations (Board Extraction)

#### 1. Time of Flight ($T$)
[08:45] At the moment of landing back on the ground, net vertical displacement $y = 0$.
Applying $y = u_y t + \\frac{1}{2} a_y t^2$:
$$ 0 = (u \\sin\\theta) T - \\frac{1}{2} g T^2 $$
Since $T \\neq 0$:
$$ T = \\frac{2u \\sin\\theta}{g} $$

<div class="callout callout-emphasized">
  <div class="callout-icon">💡</div>
  <div>
    <div class="callout-title">Teacher Emphasized (NV Sir Note):</div>
    Time to reach maximum height ($t_{up}$) is exactly half of total time of flight ($T/2 = \\frac{u \\sin\\theta}{g}$). Always use vertical components when calculating flight duration!
  </div>
</div>

#### 2. Maximum Height ($H_{\\max}$)
[15:30] At maximum height, final vertical velocity $v_y = 0$.
Applying $v_y^2 = u_y^2 + 2 a_y y$:
$$ 0 = (u \\sin\\theta)^2 - 2g H_{\\max} $$
$$ H_{\\max} = \\frac{u^2 \\sin^2\\theta}{2g} $$

#### 3. Horizontal Range ($R$)
[24:10] Horizontal distance covered in time $T$:
$$ R = u_x \\times T = (u \\cos\\theta) \\cdot \\left( \\frac{2u \\sin\\theta}{g} \\right) $$
Using trigonometric identity $2 \\sin\\theta \\cos\\theta = \\sin 2\\theta$:
$$ R = \\frac{u^2 \\sin 2\\theta}{g} $$

<div class="callout callout-mistake">
  <div class="callout-icon">⚠️</div>
  <div>
    <div class="callout-title">Common Mistake in JEE Main:</div>
    Range is maximum ($R_{\\max} = \\frac{u^2}{g}$) at $\\theta = 45^\\circ$. However, maximum height at $\\theta = 45^\\circ$ is $H = \\frac{R_{\\max}}{4}$, NOT equal to $R_{\\max}$!
  </div>
</div>

#### 4. Equation of Trajectory
[32:40] Eliminating time $t$ by substituting $t = \\frac{x}{u \\cos\\theta}$ into vertical motion equation $y = u \\sin\\theta \\cdot t - \\frac{1}{2}gt^2$:
$$ y = u \\sin\\theta \\left( \\frac{x}{u \\cos\\theta} \\right) - \\frac{1}{2} g \\left( \\frac{x}{u \\cos\\theta} \\right)^2 $$
$$ y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta} $$
Or in terms of Range $R$:
$$ y = x \\tan\\theta \\left( 1 - \\frac{x}{R} \\right) $$

---

### 🎨 Board Visual Diagram
<div class="board-diagram-box">
  <div class="board-diagram-title">Figure 1.1: Projectile Trajectory & Vector Breakdown</div>
  <svg width="100%" height="180" viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50,150 Q 250,-20 450,150" fill="none" stroke="#6366f1" stroke-width="3" stroke-dasharray="6,4"/>
    <line x1="40" y1="150" x2="480" y2="150" stroke="#9ca3af" stroke-width="2"/>
    <line x1="50" y1="160" x2="50" y2="20" stroke="#9ca3af" stroke-width="2"/>
    <!-- Velocity Arrow -->
    <line x1="50" y1="150" x2="120" y2="90" stroke="#10b981" stroke-width="3" marker-end="url(#arrow)"/>
    <text x="125" y="85" fill="#10b981" font-size="12" font-weight="bold">u (Initial Velocity)</text>
    <text x="250" y="55" fill="#f59e0b" font-size="12" font-weight="bold">v_y = 0 (At H_max)</text>
    <text x="50" y="170" fill="#9ca3af" font-size="12">Origin (0,0)</text>
    <text x="440" y="170" fill="#9ca3af" font-size="12">Range (R)</text>
  </svg>
</div>

<div class="callout callout-remember">
  <div class="callout-icon">🏆</div>
  <div>
    <div class="callout-title">Must Remember Topper Trick:</div>
    Complementary angles $\\theta$ and $(90^\\circ - \\theta)$ give the EXACT SAME horizontal range $R$ for identical launch speed $u$.
  </div>
</div>
    `,
    quiz: [
      {
        question: "A ball is projected at an angle of 30° with horizontal. If launch speed is doubled, by what factor does maximum height increase?",
        options: ["2 times", "4 times", "Square root of 2", "8 times"],
        correctIndex: 1,
        explanation: "Maximum height $H_{\\max} \\propto u^2$. Doubling $u$ makes $u^2 \\rightarrow 4u^2$, so height increases by a factor of 4."
      },
      {
        question: "Assertion (A): Range of projectile is maximum at 45°. \nReason (R): sin(2θ) reaches its maximum value of 1 when θ = 45°.",
        options: [
          "Both A and R are true, and R is the correct explanation of A",
          "Both A and R are true, but R is NOT the correct explanation",
          "A is true, R is false",
          "A is false, R is true"
        ],
        correctIndex: 0,
        explanation: "Since $R = \\frac{u^2 \\sin 2\\theta}{g}$, $R$ is maximum when $\\sin 2\\theta = 1 \\implies 2\\theta = 90^\\circ \\implies \\theta = 45^\\circ$."
      },
      {
        question: "Numerical: Find the angle of projection $\\theta$ for which Horizontal Range $R$ equals Maximum Height $H$.",
        options: ["θ = tan⁻¹(1)", "θ = tan⁻¹(2)", "θ = tan⁻¹(4)", "θ = 60°"],
        correctIndex: 2,
        explanation: "Set $R = H \\implies \\frac{u^2 \\sin 2\\theta}{g} = \\frac{u^2 \\sin^2\\theta}{2g} \\implies 2 \\sin\\theta \\cos\\theta = \\frac{\\sin^2\\theta}{2} \\implies \\tan\\theta = 4 \\implies \\theta = \\tan^{-1}(4)$."
      }
    ],
    flashcards: [
      {
        front: "Formula for Time of Flight (T) in Projectile Motion",
        back: "$$T = \\frac{2u \\sin\\theta}{g}$$"
      },
      {
        front: "Equation of Trajectory in terms of Horizontal Range (R)",
        back: "$$y = x \\tan\\theta \\left(1 - \\frac{x}{R}\\right)$$"
      },
      {
        front: "Relation between Range (R) and Max Height (H) at Launch Angle 45°",
        back: "$$R_{\\max} = 4 H$$"
      },
      {
        front: "Do complementary launch angles (θ and 90°-θ) give equal Range or equal Max Height?",
        back: "Equal Range $R$. The maximum heights are different ($H_1 / H_2 = \\tan^2\\theta$)."
      }
    ],
    pyqs: [
      {
        examTag: "JEE Main 2023",
        question: "A projectile is given an initial velocity of $\\vec{v} = (i + 2j) \\text{ m/s}$, where $i$ is along the ground and $j$ is vertically upwards. Find the equation of its trajectory ($g = 10 \\text{ m/s}^2$).",
        solution: "Here $u_x = 1$, $u_y = 2$.\nHorizontal position $x = u_x t = t \\implies t = x$.\nVertical position $y = u_y t - \\frac{1}{2}gt^2 = 2x - 5x^2$.\nHence trajectory equation is $y = 2x - 5x^2$."
      },
      {
        examTag: "JEE Advanced 2021",
        question: "Two projectiles $A$ and $B$ are thrown with equal speed $u$ at angles $45^\\circ + \\alpha$ and $45^\\circ - \\alpha$. Ratio of their horizontal ranges is:",
        solution: "Launch angles are complementary since $(45^\\circ + \\alpha) + (45^\\circ - \\alpha) = 90^\\circ$.\nSince range is identical for complementary angles at same speed, the ratio $R_A : R_B = 1 : 1$."
      }
    ]
  },
  {
    id: "preset-chemistry-organic",
    title: "General Organic Chemistry (GOC): Inductive, Resonance & Hyperconjugation",
    channel: "Physics Wallah / Pankaj Sir Organic",
    subject: "chemistry",
    exam: "NEET / JEE Main",
    language: "hinglish",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    duration: "52:10",
    summaryFormulas: [
      { label: "+I Effect Order", formula: "-O^- > -COO^- > -C(CH_3)_3 > -CH(CH_3)_2 > -CH_2CH_3" },
      { label: "-I Effect Order", formula: "-NF_3^+ > -NR_3^+ > -NO_2 > -CN > -CHO > -F > -Cl > -Br" },
      { label: "Carbocation Stability", formula: "3^\\circ > 2^\\circ > 1^\\circ > CH_3^+" },
      { label: "Carbanion Stability", formula: "CH_3^- > 1^\\circ > 2^\\circ > 3^\\circ" }
    ],
    notesMarkdown: `
# 🧪 General Organic Chemistry (GOC): Electronic Effects

### 📌 1. Inductive Effect ($I$-Effect)
[02:30] Permanent displacement of $\\sigma$-electrons along a carbon chain due to electronegativity difference between atoms.

* **Distance Dependent:** Effect diminishes rapidly after 3rd carbon atom ($C_1 > C_2 > C_3 \\gg C_4$).
* **Types:**
  1. **$+I$ Effect (Electron Donating Groups):** Groups that push electrons away relative to Hydrogen.
     * Order: $-O^- > -COO^- > -C(CH_3)_3 (3^\circ) > -CH(CH_3)_2 (2^\circ) > -CH_2CH_3 (1^\circ) > -CH_3 > -D > -H$
  2. **$-I$ Effect (Electron Withdrawing Groups):** Groups that pull electrons towards themselves.
     * Order: $-NF_3^+ > -NR_3^+ > -NH_3^+ > -NO_2 > -CN > -COOH > -F > -Cl > -Br > -I > -OH > -NH_2 > -C_6H_5$

<div class="callout callout-emphasized">
  <div class="callout-icon">💡</div>
  <div>
    <div class="callout-title">Teacher Emphasized (Pankaj Sir Shortcut):</div>
    $-I$ effect increases acidic strength of carboxylic acids! $+I$ effect decreases acidic strength. Remember formula: Acidic Strength $\\propto -I \\propto \\frac{1}{+I}$.
  </div>
</div>

---

### 🔄 2. Resonance / Mesomeric Effect ($M$ or $R$ Effect)
[18:15] Complete transfer of $\\pi$-electrons or unshared lone pairs in conjugated systems.

#### Rules of Conjugation:
1. $\\pi - \\pi$ conjugation: $CH_2 = CH - CH = CH_2$
2. $\\pi - \\text{lone pair}$ conjugation: $CH_2 = CH - \\ddot{\\text{Cl}}:$
3. $\\pi - \\text{positive charge}$ conjugation: $CH_2 = CH - CH_2^+$
4. $\\pi - \\text{free radical}$ conjugation: $CH_2 = CH - \\dot{C}H_2$

#### Resonance Stability Criteria:
* Non-polar resonating structure is more stable than polar.
* Structure with maximum covalent bonds is more stable.
* Negative charge on more electronegative atom ($O, N, F$) is more stable.

---

### ⚡ 3. Hyperconjugation (Baker-Nathan Effect)
[34:50] Delocalization of $\\sigma$-electrons of $C-\\alpha-H$ bond with empty $p$-orbital or $\\pi^*$-orbital. Also called **No-Bond Resonance**.

$$ \\text{Number of Resonating Structures} = \\text{Number of } \\alpha\\text{-Hydrogens} + 1 $$

#### Stability Order of Carbocations:
[41:10] Carbocations are stabilized by hyperconjugation and $+I$ effect:
$$ (CH_3)_3C^+ (9\\alpha-H) > (CH_3)_2CH^+ (6\\alpha-H) > CH_3CH_2^+ (3\\alpha-H) > CH_3^+ (0\\alpha-H) $$

<div class="callout callout-mistake">
  <div class="callout-icon">⚠️</div>
  <div>
    <div class="callout-title">Common NEET Trick Question:</div>
    Carbanions ($R_3C^-$) do NOT show hyperconjugation because they have no empty $p$-orbital! Carbanion stability order is OPPOSITE: $CH_3^- > 1^\circ > 2^\circ > 3^\circ$.
  </div>
</div>
    `,
    quiz: [
      {
        question: "Which of the following carbocations is most stable?",
        options: [
          "(CH₃)₃C⁺ (Tert-butyl cation)",
          "(CH₃)₂CH⁺ (Isopropyl cation)",
          "CH₃CH₂⁺ (Ethyl cation)",
          "CH₃⁺ (Methyl cation)"
        ],
        correctIndex: 0,
        explanation: "Tert-butyl cation has 9 α-hydrogens contributing to hyperconjugation + 3 alkyl groups showing +I effect."
      },
      {
        question: "Which group exhibits maximum -I effect?",
        options: ["-NO₂", "-NF₃⁺", "-CN", "-F"],
        correctIndex: 1,
        explanation: "-NF₃⁺ has a positive charge on highly electronegative nitrogen attached to 3 fluorine atoms, pulling electrons most strongly."
      }
    ],
    flashcards: [
      {
        front: "Formula for number of Hyperconjugative Resonating Structures",
        back: "$$\\text{Number of Hyperconjugative Structures} = \\text{Number of } \\alpha\\text{-Hydrogens} + 1$$"
      },
      {
        front: "Effect of -I group on Acidic Strength of Carboxylic Acids",
        back: "Increases acidic strength by stabilizing the carboxylate anion ($R-COO^-$)."
      }
    ],
    pyqs: [
      {
        examTag: "NEET 2022",
        question: "Correct order of acidic strength of substituted acetic acids is:",
        solution: "$CF_3COOH > CCl_3COOH > CHCl_2COOH > CH_2ClCOOH > CH_3COOH$.\nReason: $-I$ effect of $F > Cl$, and more halogen atoms increase acidity."
      }
    ]
  },
  {
    id: "preset-maths-integrals",
    title: "Definite Integration: King's Property & Shortcuts for JEE Advanced",
    channel: "Unacademy JEE / Arvind Kalia Sir",
    subject: "maths",
    exam: "JEE Advanced",
    language: "english",
    youtubeUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    youtubeId: "5qap5aO4i9A",
    duration: "40:15",
    summaryFormulas: [
      { label: "King's Property", formula: "\\int_a^b f(x) dx = \\int_a^b f(a + b - x) dx" },
      { label: "Queen's Property", formula: "\\int_0^{2a} f(x) dx = \\int_0^a [f(x) + f(2a - x)] dx" },
      { label: "Odd Function Integral", formula: "\\int_{-a}^a f(x) dx = 0 \\quad (\\text{if } f(-x) = -f(x))" }
    ],
    notesMarkdown: `
# 𝝅 Definite Integration: Essential Properties & King's Rule

### 👑 Property 4: King's Property (Most Important for JEE)
[03:20]
$$ \\int_a^b f(x) \\, dx = \\int_a^b f(a + b - x) \\, dx $$

#### Standard Proof Sketch:
Let $t = a + b - x \\implies dx = -dt$.
When $x = a \\implies t = b$. When $x = b \\implies t = a$.
$$ \\int_a^b f(x) dx = -\\int_b^a f(a + b - t) dt = \\int_a^b f(a + b - t) dt = \\int_a^b f(a + b - x) dx $$

---

### 💡 Classic Problem Type: $\\int_0^{\\pi/2} \\frac{\\sin^n x}{\\sin^n x + \\cos^n x} dx$
[12:40]
Let $I = \\int_0^{\\pi/2} \\frac{\\sin^n x}{\\sin^n x + \\cos^n x} \\, dx$ --- (Eq 1)

Applying King's Property ($x \\rightarrow 0 + \\frac{\\pi}{2} - x = \\frac{\\pi}{2} - x$):
$$ I = \\int_0^{\\pi/2} \\frac{\\sin^n(\\pi/2 - x)}{\\sin^n(\\pi/2 - x) + \\cos^n(\\pi/2 - x)} \\, dx $$
Since $\\sin(\\pi/2 - x) = \\cos x$ and $\\cos(\\pi/2 - x) = \\sin x$:
$$ I = \\int_0^{\\pi/2} \\frac{\\cos^n x}{\\cos^n x + \\sin^n x} \\, dx $$ --- (Eq 2)

Adding (Eq 1) and (Eq 2):
$$ 2I = \\int_0^{\\pi/2} \\frac{\\sin^n x + \\cos^n x}{\\sin^n x + \\cos^n x} \\, dx = \\int_0^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} $$
$$ I = \\frac{\\pi}{4} $$

<div class="callout callout-remember">
  <div class="callout-icon">⚡</div>
  <div>
    <div class="callout-title">Topper Shortcut:</div>
    Any integral of the form $\\int_a^b \\frac{f(x)}{f(x) + f(a+b-x)} dx = \\frac{b - a}{2}$. You can answer such JEE Main questions in 3 seconds!
  </div>
</div>
    `,
    quiz: [
      {
        question: "Evaluate ∫_{0}^{π/2} (√sin x) / (√sin x + √cos x) dx",
        options: ["π/2", "π/4", "π/8", "0"],
        correctIndex: 1,
        explanation: "By King's property shortcut: (b - a)/2 = (π/2 - 0)/2 = π/4."
      }
    ],
    flashcards: [
      {
        front: "State King's Property of Definite Integration",
        back: "$$\\int_a^b f(x) dx = \\int_a^b f(a + b - x) dx$$"
      }
    ],
    pyqs: [
      {
        examTag: "JEE Advanced 2022",
        question: "Evaluate $I = \\int_{-1}^1 \\frac{x^3 + |x| + 1}{x^2 + 2|x| + 1} dx$.",
        solution: "Split into odd and even parts:\n$x^3/(x^2+2|x|+1)$ is an odd function $\\implies \\int_{-1}^1 \\text{odd} = 0$.\nThe remaining part $\\frac{|x|+1}{(|x|+1)^2} = \\frac{1}{|x|+1}$ is even.\n$I = 2 \\int_0^1 \\frac{1}{x+1} dx = 2 [\\ln(x+1)]_0^1 = 2 \\ln 2$."
      }
    ]
  },
  {
    id: "preset-biology-cell",
    title: "Cell Cycle & Cell Division: Mitosis & Meiosis Detailed Stages",
    channel: "PW Competition Wallah / Tarun Sir Biology",
    subject: "biology",
    exam: "NEET-UG",
    language: "hinglish",
    youtubeUrl: "https://www.youtube.com/watch?v=L0k-enzoAOM",
    youtubeId: "L0k-enzoAOM",
    duration: "48:30",
    summaryFormulas: [
      { label: "Interphase Division", formula: "G_1 \\rightarrow S \\rightarrow G_2 \\rightarrow M \\text{ phase}" },
      { label: "DNA Amount in S Phase", formula: "2C \\rightarrow 4C \\quad (\\text{Chromosome number } 2N \\text{ remains same})" },
      { label: "Meiosis Output", formula: "1 \\text{ Diploid Cell (2N)} \\rightarrow 4 \\text{ Haploid Cells (1N)}" }
    ],
    notesMarkdown: `
# 🔬 Cell Cycle & Cell Division (NEET Mastery)

### 🔄 1. Phases of Cell Cycle
[02:10] The cell cycle is divided into two basic phases:
1. **Interphase (95% of cycle duration):** Resting phase where cell prepares for division by undergoing cell growth & DNA replication.
   * **$G_1$ Phase (Gap 1):** Cell is metabolically active, synthesizes RNA & proteins.
   * **$S$ Phase (Synthesis):** DNA replication takes place inside nucleus.
     * Amount of DNA doubles per cell ($2C \\rightarrow 4C$).
     * Chromosome number remains UNCHANGED ($2N \\rightarrow 2N$).
     * Centriole duplicates in cytoplasm.
   * **$G_2$ Phase (Gap 2):** Protein synthesis for mitosis continues.

---

### 🧬 2. Stages of Mitosis ($M$-Phase)
[18:40] Mitosis is an **equational division** resulting in daughter cells with identical chromosome numbers.

1. **Prophase:** Chromatin condensation starts; nucleolus, nuclear envelope & Golgi disappear.
2. **Metaphase:**
   * Chromosomes align at equatorial plate (**Metaphase Plate**).
   * Spindle fibers attach to **Kinetochores** of chromosomes.
   * *Best stage to study chromosome morphology!*
3. **Anaphase:** Sister chromatids split at centromere and move to opposite poles ($V, L, J, I$ shapes visible).
4. **Telophase:** Nuclear membrane reappears, chromosomes decondense.

<div class="callout callout-emphasized">
  <div class="callout-icon">💡</div>
  <div>
    <div class="callout-title">Teacher Emphasized (Tarun Sir Note):</div>
    Always remember: Meiosis I Prophase I has 5 sub-stages: **Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis**. (Mnemonic: *Lazy Zebra Played Double Dice*).
  </div>
</div>
    `,
    quiz: [
      {
        question: "Crossing over takes place during which sub-stage of Prophase I in Meiosis?",
        options: ["Leptotene", "Zygotene", "Pachytene", "Diplotene"],
        correctIndex: 2,
        explanation: "Recombination enzyme complex catalyzes crossing over between non-sister chromatids of homologous chromosomes during Pachytene stage."
      }
    ],
    flashcards: [
      {
        front: "What happens to DNA amount (C) and Chromosome number (N) during S-Phase?",
        back: "DNA amount doubles ($2C \\rightarrow 4C$), but Chromosome number remains the same ($2N$)."
      }
    ],
    pyqs: [
      {
        examTag: "NEET 2023",
        question: "Match List I with List II:\n(A) Pachytene - (i) Dissolution of synaptonemal complex\n(B) Metaphase I - (ii) Crossing over\n(C) Diplotene - (iii) Chromosomes align at equatorial plate",
        solution: "A-(ii), B-(iii), C-(i)."
      }
    ]
  }
];
