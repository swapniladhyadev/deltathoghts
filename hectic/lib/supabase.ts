import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NoteItem {
  id: string;
  user_id?: string;
  video_url: string;
  video_id: string;
  title: string;
  channel_name?: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General';
  exam_category: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'CBSE Board' | 'General';
  summary: string;
  board_extract: string;
  spoken_extract: string;
  key_formulas: string[];
  full_markdown: string;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  formula?: string;
}

export interface QuizItem {
  id: string;
  note_id: string;
  questions: QuizQuestion[];
  flashcards: Flashcard[];
  created_at: string;
}

// Fallback Mock Data for immediate demo display when Supabase keys are not active
export const SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'sample-jee-physics-01',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    title: 'Rotational Motion & Moment of Inertia of Rigid Bodies',
    channel_name: 'Physics Wallah - Alakh Pandey',
    subject: 'Physics',
    exam_category: 'JEE Main',
    summary: 'Comprehensive lecture covering Parallel and Perpendicular Axis Theorems, Radius of Gyration, and Torque equations for regular symmetric bodies.',
    board_extract: `### 📌 Blackboard Written Equations & Diagrams
- **Definition of Torque**: $\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I \\vec{\\alpha}$
- **Parallel Axis Theorem**: $I_{new} = I_{cm} + M d^2$
- **Perpendicular Axis Theorem** (Valid only for 2D planar bodies): $I_z = I_x + I_y$
- **Moment of Inertia Table Written by Teacher**:
  1. Solid Cylinder about symmetric axis: $I = \\frac{1}{2} M R^2$
  2. Hollow Sphere: $I = \\frac{2}{3} M R^2$
  3. Solid Sphere: $I = \\frac{2}{5} M R^2$`,
    spoken_extract: `### 🗣️ Teacher's Verbal Explanations & Exam Gotchas
- *Key Exam Caution*: Students often confuse hollow sphere vs solid sphere in JEE Advanced multi-correct questions. Always check if the sphere is rolling without slipping on an inclined plane.
- *Problem Solving Trick*: For composite objects (e.g. disc with a circular hole cut out), calculate $I_{total} = I_{full} - I_{removed}$ using negative mass concept.`,
    key_formulas: [
      '\\tau = I \\alpha',
      'I = \\sum m_i r_i^2',
      'I_{parallel} = I_{cm} + Md^2',
      'K_{rotational} = \\frac{1}{2} I \\omega^2'
    ],
    full_markdown: `# Rotational Motion: Moment of Inertia

## 1. Concept Overview
Moment of Inertia ($I$) represents the rotational inertia of a body regarding a given axis.

$$\\begin{aligned}
I &= \\int r^2 dm \\\\
L &= I \\omega
\\end{aligned}$$

## 2. Important Theorems
### Parallel Axis Theorem
For any body with mass $M$ and center of mass moment of inertia $I_{cm}$:
$$I = I_{cm} + M d^2$$

### Perpendicular Axis Theorem
For a laminar body in the XY-plane:
$$I_z = I_x + I_y$$

## 3. JEE Main & Advanced Practice Tips
- Apply conservation of Angular Momentum when no external torque acts ($\\sum \\tau_{ext} = 0$).
- Pure rolling condition: $v_{cm} = R \\omega$ and acceleration $a_{cm} = R \\alpha$.`,
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-neet-chem-02',
    video_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    video_id: '3JZ_D3ELwOQ',
    title: 'Chemical Equilibrium & Le Chatelier\'s Principle',
    channel_name: 'Unacademy NEET',
    subject: 'Chemistry',
    exam_category: 'NEET',
    summary: 'Detailed explanation of equilibrium constants (Kp and Kc), reaction quotient Q, and effect of temperature, pressure, and catalyst.',
    board_extract: `### 📌 Blackboard Written Equations & Reactions
- **Equilibrium Constant Relation**: $K_p = K_c (R T)^{\\Delta n_g}$
- **Reaction Quotient Rules**:
  - If $Q < K_c$: Reaction proceeds in **forward** direction.
  - If $Q > K_c$: Reaction proceeds in **backward** direction.
  - If $Q = K_c$: System is at dynamic equilibrium.
- **Van\'t Hoff Equation written on board**:
  $$\\ln \\left(\\frac{K_2}{K_1}\\right) = \\frac{\\Delta H^\\circ}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)$$`,
    spoken_extract: `### 🗣️ Teacher's Verbal Guidance for NEET
- Addition of an inert gas at constant volume has **NO effect** on equilibrium.
- Addition of inert gas at constant pressure shifts equilibrium to the side with greater number of gas moles.
- Catalyst speeds up both forward and reverse reaction equally; it does **not** change $K_c$.`,
    key_formulas: [
      'K_p = K_c (RT)^{\\Delta n_g}',
      '\\Delta G^\\circ = -R T \\ln K',
      'Q_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}'
    ],
    full_markdown: `# Chemical Equilibrium & Thermodynamics

## 1. Equilibrium Constant Expression
For reaction $aA + bB \\rightleftharpoons cC + dD$:

$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$

## 2. Le Chatelier's Principle
If a dynamic equilibrium is disturbed by changing conditions, the position of equilibrium moves to counteract the change.

| Disturbance | Shift Direction |
| :--- | :--- |
| Increase reactant concentration | Forward |
| Increase pressure (gas) | Towards fewer gas moles |
| Increase temp (Endothermic) | Forward |`,
    created_at: new Date().toISOString()
  }
];

export const SAMPLE_QUIZZES: Record<string, QuizItem> = {
  'sample-jee-physics-01': {
    id: 'quiz-01',
    note_id: 'sample-jee-physics-01',
    created_at: new Date().toISOString(),
    questions: [
      {
        question: 'A uniform circular disc of mass M and radius R has moment of inertia about a tangential axis perpendicular to its plane given by:',
        options: [
          '\\frac{1}{2} M R^2',
          '\\frac{3}{2} M R^2',
          '\\frac{5}{4} M R^2',
          '2 M R^2'
        ],
        answerIndex: 1,
        explanation: 'By center of mass axis $I_{cm} = \\frac{1}{2} M R^2$. Using Parallel Axis theorem at distance $d = R$: $I = I_{cm} + M R^2 = \\frac{1}{2} M R^2 + M R^2 = \\frac{3}{2} M R^2$.'
      },
      {
        question: 'If torque acting on a body is zero (\\tau = 0), which quantity remains conserved?',
        options: [
          'Linear Momentum',
          'Angular Momentum',
          'Rotational Kinetic Energy',
          'Moment of Inertia'
        ],
        answerIndex: 1,
        explanation: 'Since $\\tau = \\frac{dL}{dt}$, if $\\tau = 0$, then angular momentum $L$ is constant.'
      },
      {
        question: 'What is the radius of gyration of a solid sphere of radius R about its diameter axis?',
        options: [
          '\\sqrt{\\frac{2}{5}} R',
          '\\sqrt{\\frac{1}{2}} R',
          '\\sqrt{\\frac{2}{3}} R',
          'R'
        ],
        answerIndex: 0,
        explanation: 'For a solid sphere, $I = \\frac{2}{5} M R^2 = M k^2 \\implies k = \\sqrt{\\frac{2}{5}} R$.'
      }
    ],
    flashcards: [
      {
        front: 'What is the Parallel Axis Theorem formula?',
        back: 'I = I_cm + M * d^2, where d is distance between parallel axes.',
        formula: 'I_{new} = I_{cm} + M d^2'
      },
      {
        front: 'What is the relationship between Torque and Angular Acceleration?',
        back: 'Torque equals Moment of Inertia times Angular Acceleration.',
        formula: '\\tau = I \\cdot \\alpha'
      },
      {
        front: 'What is the Rotational Kinetic Energy of a body?',
        back: 'Half times Moment of Inertia times Angular Velocity squared.',
        formula: 'K_{rot} = \\frac{1}{2} I \\omega^2'
      }
    ]
  }
};
