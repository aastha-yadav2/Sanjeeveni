# Sanjeevani AI 🏥✨

> **Multilingual, Voice-First Health Triage Assistant Powered by Google Gemma**

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/aastha-yadav2/Sanjeeveni)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Gemma](https://img.shields.io/badge/AI-Google%20Gemma%202-4285F4)](https://ai.google.dev/gemma)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-TypeScript-3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB)](https://www.python.org/)

---

## 📌 Important Medical Disclaimer

> [!IMPORTANT]
> **Sanjeevani AI is strictly an AI-assisted health triage and informational guidance system.** It does **NOT** provide formal medical diagnoses, prescribe medications, or replace certified human healthcare professionals or emergency medical services.
> 
> **If you or someone around you is experiencing a medical emergency (such as severe chest pain, extreme difficulty breathing, or loss of consciousness), call your local emergency services (911 / 108) immediately.**

---

## 📖 Overview

**Sanjeevani AI** is an open-source, multilingual, voice-first health triage application created for the **Build with Gemma Hackathon**. It helps users describe symptoms naturally in their preferred language (via speech or text), receives clinical follow-up questions from a Google Gemma LLM backend, displays real-time urgency evaluations, and generates downloadable medical summary briefs.

The architecture is strictly decoupled: the React frontend manages presentation, voice input (Web Speech API), and user state, while the FastAPI backend handles clinical prompt engineering, Google Gemma LLM inference, JSON contract validation, and emergency red-flag guardrails.

---

## 🚀 Live Demo & Deployment

- 🌐 **Frontend Application**: Deployed on Vercel *(connected to live backend)*
- ⚡ **FastAPI Backend Engine**: [`https://sanjeeveni.onrender.com/`](https://sanjeeveni.onrender.com/)
- 📖 **Interactive API Documentation**: [`https://sanjeeveni.onrender.com/docs`](https://sanjeeveni.onrender.com/docs)
- 🟢 **Backend Health Endpoint**: [`https://sanjeeveni.onrender.com/health`](https://sanjeeveni.onrender.com/health)

---

## 🎯 Problem Statement & Proposed Solution

### The Problem
- **Language Barriers**: Millions of non-English speakers face difficulty communicating symptoms accurately during initial health consultations.
- **Triage Confusion**: Patients often struggle to distinguish between self-treatable mild symptoms, conditions requiring a general physician within 48 hours, and immediate medical emergencies.
- **Overcrowded Emergency Rooms**: Patients visit emergency departments for non-urgent issues due to a lack of accessible preliminary guidance.

### The Solution
- **Voice-First & Multilingual**: Speak or type symptoms in 10 regional and international languages (English, Hindi, Spanish, Bengali, Tamil, Telugu, Marathi, Gujarati, French, German).
- **Google Gemma Clinical Triage**: Decoupled FastAPI backend leveraging fine-tuned Google Gemma models (`gemma-2-9b-it`) to structure symptom data, evaluate urgency, and suggest care pathways.
- **Emergency Guardrails**: Automated red-flag detection triggering immediate 911 / 108 emergency alerts.
- **Exportable PDF Summary**: One-click generation of printable medical briefs for doctor consultations.

---

## ✨ Key Features

- **🌐 Multilingual Triage**: Native support for 10 regional & international languages (English, Hindi, Spanish, Bengali, Tamil, Telugu, Marathi, Gujarati, French, German).
- **🎙️ Real-time Voice Input**: Browser-native Web Speech API (`SpeechRecognition`) with pulsing audio waveform visualizer and text-to-speech audio readout (`SpeechSynthesis`).
- **🤖 Powered by Google Gemma LLM**: Multi-turn triage dialogues with reasoning steps, clinical follow-up questions, and structured JSON parsing.
- **⚡ Red-Flag Emergency Interceptor**: Automated safety triggers for chest pain, dyspnea, unconsciousness, or heavy bleeding that immediately enforce `urgency: "Emergency"` and direct users to emergency care.
- **📊 Live Health Summary Sidebar**: Real-time extraction of symptom tags, duration, urgency ratings (`Low`, `Moderate`, `High`, `Emergency`), and Gemma confidence scores.
- **📄 Downloadable PDF Reports**: Professional printable medical brief report generated using `jsPDF`, `html2canvas`, and celebratory `canvas-confetti`.
- **🎨 Glassmorphic Material Design**: Modern UI with soft 20px rounded glass cards (`backdrop-blur-md bg-white/75`), curated blue/cyan palette (`#2563EB` & `#06B6D4`), and Google Font **Plus Jakarta Sans**.

---

## 📐 System Architecture

```
User (Voice / Text)
       │
       ▼
React Frontend (Web Speech STT / Voice Input)
       │
       ▼  HTTP POST /api/chat (JSON Contract)
FastAPI Backend (app/main.py)
       │
       ▼
Prompt Manager (Guardrails, History & Multilingual Context)
       │
       ▼
Google Gemma AI API (gemma-2-9b-it)
       │
       ▼  Structured JSON Payload
Validation & Auto-Repair Retry Layer
       │
       ▼
React UI (Chat Stream, Urgency Badges, Live Health Summary & PDF Export)
```

For complete technical details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🌐 Supported Languages

| Language | Code | Native Name | Flag |
| :--- | :---: | :--- | :---: |
| **English** | `en` | English | 🇬🇧 |
| **Hindi** | `hi` | हिन्दी | 🇮🇳 |
| **Spanish** | `es` | Español | 🇪🇸 |
| **Bengali** | `bn` | বাংলা | 🇮🇳 |
| **Tamil** | `ta` | தமிழ் | 🇮🇳 |
| **Telugu** | `te` | తెలుగు | 🇮🇳 |
| **Marathi** | `mr` | मराठी | 🇮🇳 |
| **Gujarati** | `gu` | ગુજરાતી | 🇮🇳 |
| **French** | `fr` | Français | 🇫🇷 |
| **German** | `de` | Deutsch | 🇩🇪 |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3, TypeScript 5.7, Vite 6.0
- **Styling**: Tailwind CSS 3.4, Vanilla CSS Glassmorphism
- **Icons**: Lucide Icons (`lucide-react`)
- **Animations**: Framer Motion 11.18, Tailwind Keyframe Animations
- **PDF & Export**: `jsPDF` 2.5, `html2canvas` 1.4, `canvas-confetti` 1.9
- **Speech**: Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Routing**: React Router DOM 7.1

### Backend
- **Framework**: FastAPI 0.115+, Python 3.10+
- **Server**: Uvicorn 0.30+
- **Validation**: Pydantic 2.8+
- **AI SDK**: Google GenAI (`google-genai` / `google-generativeai`), `httpx` 0.27+
- **Environment**: `python-dotenv` 1.0

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10.0 or higher
- **Google Gemma API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/aastha-yadav2/Sanjeeveni.git
cd Sanjeeveni
```

---

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will run locally at `http://localhost:3000` (or `http://localhost:5173`).

---

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env
```

Edit `.env` and set your API key:
```env
GEMMA_API_KEY=your_actual_google_gemma_api_key_here
GEMMA_MODEL_NAME=gemma-2-9b-it
PORT=8000
HOST=0.0.0.0
```

Start the FastAPI backend server:
```bash
python -m app.main
```
The backend server will start at `http://localhost:8000`. Swagger API docs will be available at `http://localhost:8000/docs`.

---

## 📁 Repository Structure

```
Sanjeeveni/
├── README.md                      # Project landing documentation
├── LICENSE                        # MIT Open Source License
├── CONTRIBUTING.md                # Contribution guidelines
├── SECURITY.md                    # Security policy & disclosure instructions
├── CODE_OF_CONDUCT.md             # Contributor Covenant Code of Conduct
├── CHANGELOG.md                   # Chronological project history
├── index.html                     # HTML5 entrypoint with Google Fonts
├── package.json                   # Frontend dependencies & scripts
├── vite.config.ts                 # Vite bundler configuration
├── tailwind.config.js             # Custom Tailwind CSS theme tokens
├── main.py                        # Root FastAPI launcher (Render deployment fallback)
├── Procfile                       # Render / Heroku process configuration
├── vercel.json                    # Vercel SPA routing rewrite rules
├── backend/                       # Python FastAPI Backend
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment variable placeholders
│   ├── render.yaml                # Render Blueprint deployment specification
│   └── app/
│       ├── main.py                # FastAPI app initialization & CORS middleware
│       ├── config.py              # Environment settings configuration
│       ├── api/                   # REST API Routers
│       │   ├── chat.py            # POST /api/chat, POST /api/session/new
│       │   ├── report.py          # POST /api/report
│       │   └── hospital.py        # GET /api/hospitals
│       ├── models/
│       │   └── schemas.py         # Pydantic data validation schemas
│       └── services/
│           ├── gemma_service.py   # Google Gemma LLM API caller & JSON validator
│           ├── prompt_manager.py  # System prompts & repair templates
│           ├── report_service.py  # Clinical brief report generator
│           └── hospital_service.py# Healthcare facility search service
├── src/                           # React TypeScript Frontend
│   ├── main.tsx                   # React root renderer
│   ├── App.tsx                    # React Router configuration
│   ├── index.css                  # Global Tailwind directives & glassmorphism CSS
│   ├── types/
│   │   └── triage.ts              # TypeScript interface definitions
│   ├── services/
│   │   ├── api.ts                 # Centralized REST API service abstraction
│   │   └── speechService.ts       # Web Speech API STT/TTS service
│   ├── data/
│   │   ├── languages.ts           # ISO language metadata & flag mappings
│   │   ├── faqData.ts             # FAQ dataset
│   │   └── mockData.ts            # Default session data
│   ├── components/
│   │   ├── layout/                # Navbar & Footer components
│   │   ├── chat/                  # ChatBubble, ChatHistorySidebar, HealthSummarySidebar
│   │   ├── report/                # PrintableReport PDF component
│   │   └── ui/                    # UrgencyBadge, VoiceButton, TypingIndicator, Toast
│   └── pages/                     # LandingPage, AssessmentPage, ReportPage, AboutPage
└── docs/                          # Detailed Technical Documentation
    ├── ARCHITECTURE.md            # In-depth system architecture & Mermaid diagrams
    ├── SAFETY.md                  # Medical disclaimers & red-flag safety guardrails
    ├── API.md                     # Endpoint specifications & JSON schemas
    └── TESTING.md                 # Automated build verification & manual test suite
```

---

## 🔍 Documentation Directory

For deeper technical documentation, refer to the `/docs` directory:

- 📐 **[System Architecture](docs/ARCHITECTURE.md)**: Frontend & backend breakdown, data flow, and Mermaid diagrams.
- 🛡️ **[Safety & Clinical Guardrails](docs/SAFETY.md)**: Intended scope, red-flag detection rules, and emergency protocols.
- 🔌 **[API Documentation](docs/API.md)**: Request/response schemas, endpoint parameters, and curl examples.
- 🧪 **[Testing & Verification](docs/TESTING.md)**: Automated build checks, manual test matrices, and verification scenarios.

---

## 📌 Known Limitations & Future Scope

### Known Limitations
- **Browser Speech Recognition Dependency**: Web Speech API (`webkitSpeechRecognition`) availability depends on browser support (best experienced on Google Chrome, Edge, and Safari).
- **Cold Start Latency on Free Tier**: The backend hosted on Render free tier may experience a short cold-start delay if inactive for 15+ minutes.

### Future Scope
- **Real-Time GPS Hospital Search**: Integration with Google Maps API / OpenStreetMap Overpass API for real-time local emergency room navigation.
- **Electronic Health Record (EHR) Export**: Support for HL7 / FHIR JSON export formats.
- **Multimodal Symptom Capture**: Image input support for skin rash / lesion visual triage using Gemini Multimodal models.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing & Community

Contributions, issues, and feature requests are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

- 🐛 [Report a Bug](https://github.com/aastha-yadav2/Sanjeeveni/issues)
- 💡 [Request a Feature](https://github.com/aastha-yadav2/Sanjeeveni/issues)
- 🛡️ [Security Policy](SECURITY.md)
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md)
