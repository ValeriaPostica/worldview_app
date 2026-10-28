# ALETHEIA — Philosophical Vector Engine & Worldview Oracle

Aletheia is an interactive web application designed to analyze a user's dialectic choices, ethical values, and cultural preferences to synthesize and display a distinct philosophical archetype (Worldview).

The application combines the medieval aesthetic of an illuminated manuscript and sacred parchment with a modern, fast, and modular React architecture. It generates radar charts across five metaphysical dimensions and offers recommendations grounded in key historical thinkers such as Socrates, Plato, Marcus Aurelius, Camus, and Nietzsche.

---

## Key Features

- Zero-Latency Engine: Local deterministic calculation based on weighting vectors, allowing the app to run 100% offline without external API dependencies or network latency.
- Digital Manuscript Interface: An immersive dark-manuscript design featuring gold accents, editorial typography, responsive cards, progress feedback, and subtle motion.
- Soul Geometry Map (Radar Chart): Graphical visualization across 5 core philosophical axes:
  1. Ethics: Deontology (Kant) vs. Utilitarianism (Mill)
  2. Epistemology: Rationalism (Descartes) vs. Empiricism (Hume)
  3. Existential Dimension: Existentialism (Sartre/Camus) vs. Teleology (Aristotle)
  4. Metaphysics: Materialism/Physicalism vs. Idealism/Dualism
  5. Agency: Determinism vs. Free Will
- Philosophical Canon & Recommended Media: Each outcome features matched classic books, films, and essays complete with authentic historical portraits and artwork.
- Local Persistence (Folio & Bookmarks): Save assessment history and favorite reading materials directly to local storage.
- PNG Export: Render and download the resulting manuscript scroll as an image using html2canvas.
- Shareable Results: Copy or share a concise worldview snapshot using the Web Share API when available.
- Discoverable Library: Search the recommendation shelf and filter it by medium without leaving the app.
- Guided Reflection: Live answer progress, a daily philosophical thought, and privacy-first onboarding reduce friction.
- Idea Universe: Explore a star map of philosophy questions, personalized around the worldview from your latest reflection.

---

## Tech Stack

- Core & UI: React 18+, Vite
- Styling: Tailwind CSS v4, CSS Modules/Custom Styles
- Visuals & Charts: Chart.js, react-chartjs-2
- Icons: Lucide React
- Visual Effects: Canvas Confetti
- Export Utility: html2canvas

---

## Project Structure

The project follows clean code principles and separation of concerns:

```text
aletheia-app/
├── public/                     # Static assets
├── src/
│   ├── components/             # Modular React components
│   │   ├── Header.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Application footer
│   │   ├── Modal.jsx           # Pop-up modal for detailed summaries
│   │   ├── OracleStep1.jsx     # Step I: Cultural anchors (Books, Movies, Quotes)
│   │   ├── OracleStep2.jsx     # Step II: Dialectic questionnaire
│   │   ├── OracleStep3.jsx     # Step III: Processing and synthesis screen
│   │   ├── OracleStep4.jsx     # Step IV: Full archetype result & Radar Chart
│   │   ├── Dashboard.jsx       # Folio section (Saved evaluations history)
│   │   └── Library.jsx         # Canon section (Books and movies index)
│   ├── data/
│   │   └── worldviewData.json  # Database containing questions, paradoxes, and archetypes
│   ├── styles/
│   │   └── App.css             # Custom styles for the parchment visual effect
│   ├── App.jsx                 # Global state management and main routing
│   ├── index.css               # Tailwind CSS imports and Google Fonts
│   └── main.jsx                # React entry point
├── index.html                  # Main HTML template
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## Product direction

Aletheia is a reflection tool, not a personality diagnosis. Results are private to the browser by default, can be revisited from Saved, and are framed as lenses for curiosity rather than permanent labels. The core assessment works offline; Gemini is an optional enhancement for contextual recommendations and conversation.

---

## Calculation Algorithm

1. Response Collection: The user completes a set of binary "This or That" dialectic questions.
2. Vector Weighting: Each chosen option assigns numerical points across 5 distinct philosophical dimensions.
3. Archetype Mapping: The algorithm evaluates the predominant score combination and selects the corresponding archetype from the database (e.g., Stoic Empirical Rationalist or Existential Absurdist).
4. Result Rendering: The system displays score values on a Radar Chart along with matching historical portraits, key philosophical quotes, and canonical recommendations.

---

## Installation and Setup Guide

Follow these steps to run the project locally on your machine:

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Step 1: Navigate to the Project Directory

Open your terminal and enter the project folder:

```bash
cd aletheia-app
```

### Step 2: Install Dependencies

Run the package manager installation command:

```bash
npm install
```

### Step 3: Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open the provided local URL (typically `http://localhost:5173/`) in your browser to view the application.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with hot module replacement. |
| `npm run build` | Compiles the production build into the `dist/` folder. |
| `npm run preview` | Locally previews the compiled production build. |

---

## License

This project was developed for educational purposes for the Philosophy curriculum. All visual and textual assets are sourced from the public domain (Wikimedia Commons) or distributed under open licenses.