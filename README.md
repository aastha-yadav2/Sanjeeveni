# Sanjeevani AI 🏥✨
> **Multilingual, Voice-First Health Triage Assistant Powered by Google Gemma**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Gemma](https://img.shields.io/badge/AI-Google%20Gemma-2563EB.svg)](https://ai.google.dev/gemma)
[![Built with React](https://img.shields.io/badge/Framework-React%2018%20%2B%20TypeScript-06B6D4.svg)](https://react.dev/)

**Sanjeevani AI** is a production-ready, voice-first health triage web application designed to help users describe symptoms in their preferred language, answer intelligent clinical follow-up questions, evaluate urgency levels, and generate exportable medical brief reports.

---

## 🌟 Key Features

- **🌐 Multilingual Support**: Communicate in 10+ regional & international languages (English, Hindi, Spanish, Bengali, Tamil, Telugu, Marathi, Gujarati, French, German).
- **🎙️ Voice Conversations**: Real-time browser speech recognition (Web Speech API) with animated audio visualizer & voice playback.
- **🤖 Powered by Google Gemma AI**: Clinical decision matrix simulating multi-turn triage dialogues and reasoning steps.
- **⚡ Emergency Detection**: Red-flag symptom detection (acute chest pain, dyspnea) triggers immediate 911 / 108 emergency alerts.
- **📊 Live Health Summary Sidebar**: Real-time symptom extraction, urgency badges (Low, Moderate, High, Emergency), AI confidence score, and care pathway guidance.
- **📄 Downloadable PDF Reports**: One-click generation of printable medical brief reports with patient summary & transcript logs.
- **🎨 Glassmorphic Material Aesthetics**: Custom Tailwind CSS design tokens, soft 20px rounded cards, vibrant gradients (`#2563EB` & `#06B6D4`), and Framer Motion micro-interactions.

---

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom HSL/HEX theme system), Vanilla CSS Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **PDF Export**: jsPDF + html2canvas
- **Speech API**: Native Web Speech API (Recognition + Synthesis)
- **Routing**: React Router DOM v7

---

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aastha-yadav2/Sanjeeveni.git
   cd Sanjeeveni
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```
Sanjeevani AI/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatHistorySidebar.tsx
│   │   │   └── HealthSummarySidebar.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── report/
│   │   │   └── PrintableReport.tsx
│   │   └── ui/
│   │       ├── LanguageSelector.tsx
│   │       ├── Toast.tsx
│   │       ├── TypingIndicator.tsx
│   │       ├── UrgencyBadge.tsx
│   │       └── VoiceButton.tsx
│   ├── data/
│   │   ├── faqData.ts
│   │   ├── languages.ts
│   │   └── mockTriageFlows.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AssessmentPage.tsx
│   │   ├── LandingPage.tsx
│   │   └── ReportPage.tsx
│   ├── services/
│   │   ├── gemmaTriageEngine.ts
│   │   └── speechService.ts
│   ├── types/
│   │   └── triage.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## ⚠️ Healthcare Disclaimer

Sanjeevani AI is strictly an educational health triage assessment tool. It does **NOT** diagnose medical conditions, prescribe treatments, or replace certified human clinicians. If experiencing a severe medical emergency, contact emergency medical services immediately.