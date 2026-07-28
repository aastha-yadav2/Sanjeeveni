# Testing & Verification Guide - Sanjeevani AI

> **Test Strategy, Automated Verification, and Manual Test Scenarios for Sanjeevani AI**

---

## 🟢 Implemented Automated Verification

### 1. Frontend Build & TypeScript Compilation
The frontend utilizes TypeScript 5.7+ strict compilation checked during Vite production bundling.

```bash
# Execute frontend build verification
npm run build
```

**Verification Criteria**:
- `tsc` exits with **0 errors**.
- Vite compiles static bundle outputs into `dist/`.

### 2. Backend Pydantic Schema Validation
The FastAPI backend enforces runtime request/response schema validation via Pydantic (`backend/app/models/schemas.py`). Any payload violating expected data types returns HTTP `422 Unprocessable Entity`.

```bash
# Verify backend startup
python -m app.main
```

---

## 📋 Recommended & Executed Manual Test Scenarios

The following manual test protocols verify clinical guardrails, voice input pipelines, PDF export, and multilingual support:

---

### Scenario 1: Standard Mild Triage Flow
- **Input Text / Voice**: *"I have had a mild fever and cough for two days."*
- **Language**: English (`en`)
- **Expected Behavior**:
  - Assistant acknowledges symptom (Fever + Cough, 2 days).
  - Prompts for missing patient age.
  - Health Summary updates: `urgency: "Moderate"`, `emergency: false`.
  - Care recommendation suggests physician consultation within 24-48 hours.
- **Verification Status**: ✅ Verified

---

### Scenario 2: Multilingual Dialogue (Hindi)
- **Input Text / Voice**: *"मुझे 2 दिनों से तेज़ बुखार और सिरदर्द है।"*
- **Language**: Hindi (`hi`)
- **Expected Behavior**:
  - Assistant responds fluently in Hindi: *"समझा। तेज़ बुखार और सिरदर्द..."*
  - Health Summary extracts Hindi symptoms correctly into summary card.
  - Follow-up questions rendered in Devanagari script.
- **Verification Status**: ✅ Verified

---

### Scenario 3: Emergency Red-Flag Trigger
- **Input Text / Voice**: *"I have severe chest pain and shortness of breath."*
- **Language**: English (`en`)
- **Expected Behavior**:
  - Immediate red-flag safety override engaged.
  - UI displays high-priority **EMERGENCY ALERT** banner.
  - Urgency Badge updates to **`EMERGENCY`** (`emergency: true`).
  - Assistant response directs patient to call 911 / 108 immediately.
- **Verification Status**: ✅ Verified

---

### Scenario 4: Voice Speech-to-Text & Text-to-Speech
- **Input Action**: Click Microphone Button (🎙️).
- **Expected Behavior**:
  - Pulsing soundwave animation ring appears.
  - Web Speech API listens and populates the text field in real-time.
  - Assistant bubble speaker icon reads response aloud cleanly using `window.speechSynthesis`.
- **Verification Status**: ✅ Verified

---

### Scenario 5: PDF Medical Brief Report Export
- **Action**: Click *"Generate & Download Report"* in sidebar.
- **Expected Behavior**:
  - Navigates to `/report` page.
  - Renders patient profile, urgency rating, reported symptoms, and transcript.
  - Click *"Download PDF"*: `html2canvas` + `jsPDF` compiles a `.pdf` file.
  - `canvas-confetti` animation fires upon completion.
- **Verification Status**: ✅ Verified

---

### Scenario 6: SPA Route Refreshing on Vercel
- **Action**: Direct browser navigation or refresh (F5) on `/assessment`, `/report`, or `/about`.
- **Expected Behavior**:
  - `vercel.json` SPA rewrite rules redirect traffic to `/index.html`.
  - Page loads cleanly without Vercel 404 errors.
- **Verification Status**: ✅ Verified

---

## 🔮 Recommended Automated Test Additions (Future Roadmap)

*Note: The scenarios below represent recommended additions for future releases and are not currently automated in the CI pipeline.*

- **Unit Testing**: Vitest + React Testing Library for isolated UI component testing.
- **Backend API Testing**: Pytest + `httpx.AsyncClient` integration tests for `/api/chat` and `/api/report`.
- **E2E Testing**: Playwright end-to-end browser automation tests for full chat-to-PDF user flows.
