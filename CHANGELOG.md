# Changelog

All notable changes to the **Sanjeevani AI** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Comprehensive repository documentation suite (`docs/ARCHITECTURE.md`, `docs/SAFETY.md`, `docs/API.md`, `docs/TESTING.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`).

---

## [1.0.0] - 2026-07-28

### Added
- **Multilingual Support**: Support for 10 regional & international languages (English, Hindi, Spanish, Bengali, Tamil, Telugu, Marathi, Gujarati, French, German) in frontend language selectors and backend prompts.
- **Voice-First Speech Engine**: Real-time browser Speech-to-Text (`SpeechRecognition`) with pulsing soundwave animation ring and Text-to-Speech audio readout (`SpeechSynthesis`).
- **Google Gemma LLM Integration**: Production-grade integration with Google Gemma (`gemma-2-9b-it`) via Google Generative AI API in `backend/app/services/gemma_service.py`.
- **JSON Validation & Auto-Repair**: Pydantic schema validation (`ChatResponseSchema`) with automated JSON repair retry loop for 100% contract compliance.
- **Emergency Red-Flag Guardrails**: Automated safety interceptor triggering high-priority emergency alerts for acute chest pain, dyspnea, unconsciousness, or heavy bleeding.
- **Printable Medical Report & PDF Export**: PDF report generation using `html2canvas` + `jsPDF` with celebratory `canvas-confetti` animation and `@media print` CSS rules.
- **FastAPI Backend Engine**: Modular Python FastAPI server featuring endpoints for `/api/chat`, `/api/session/new`, `/api/report`, `/api/hospitals`, `/api/languages`, and `/health`.
- **Render & Vercel Deployment Configurations**: Added root `main.py`, `Procfile`, `backend/render.yaml`, and `vercel.json` for seamless deployment on Render and Vercel.

### Changed
- **Decoupled Architecture**: Refactored frontend to eliminate client-side medical decision logic; all triage reasoning is routed through `src/services/api.ts` to the FastAPI backend.
- **CORS & Root Handlers**: Added wildcard CORS middleware and `@app.get("/")` root welcome status handler in FastAPI.

### Fixed
- **Render Deployment 404 Fix**: Added root `main.py` launcher and `Procfile` ensuring Render detects FastAPI regardless of root directory configuration.
- **Vercel SPA Route Refresh Fix**: Added `vercel.json` rewrite rules resolving 404 errors on direct navigation to `/assessment`, `/report`, or `/about`.
- **Build Cleanup**: Removed leftover FIFA demo components and updated `tsconfig.json` to resolve TypeScript compilation errors during Vercel builds.
