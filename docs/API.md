# API Reference Documentation - Sanjeevani AI

> **FastAPI Backend REST API Endpoints Specification**

Base Production URL: `https://sanjeeveni.onrender.com`  
Base Local URL: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs` or `/docs`  
ReDoc Specification: `http://localhost:8000/redoc` or `/redoc`

---

## 📋 Endpoint Summary

| Method | Path | Summary | Authentication |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | API Root Status & Documentation Links | None |
| `GET` | `/health` | Backend Health Check & Gemma Model Designation | None |
| `GET` | `/api/languages` | Supported ISO Languages Array | None |
| `POST` | `/api/chat` | Main Google Gemma AI Triage Chat Endpoint | None |
| `POST` | `/api/session/new` | Initialize New Assessment Session | None |
| `DELETE` | `/api/session/{session_id}` | Clear Active Session State | None |
| `POST` | `/api/report` | Generate Medical Brief Report Record | None |
| `GET` | `/api/hospitals` | Query Healthcare Facilities & Emergency Rooms | None |

---

## 1. GET `/`

### Purpose
Returns API operational status, service version, and links to documentation.

### Response `200 OK`
```json
{
  "message": "Sanjeevani AI FastAPI Engine is live!",
  "status": "healthy",
  "docs": "/docs",
  "health": "/health",
  "version": "1.0.0"
}
```

---

## 2. GET `/health`

### Purpose
Returns health check information and active Google Gemma model designation.

### Response `200 OK`
```json
{
  "status": "healthy",
  "service": "Sanjeevani AI FastAPI Backend",
  "gemmaModel": "gemma-2-9b-it",
  "version": "1.0.0"
}
```

---

## 3. GET `/api/languages`

### Purpose
Returns list of supported multilingual language codes, native names, and flag icons.

### Response `200 OK`
```json
[
  {"code": "en", "name": "English", "nativeName": "English", "flag": "🇬🇧"},
  {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "flag": "🇮🇳"},
  {"code": "es", "name": "Spanish", "nativeName": "Español", "flag": "🇪🇸"},
  {"code": "bn", "name": "Bengali", "nativeName": "বাংলা", "flag": "🇮🇳"},
  {"code": "ta", "name": "Tamil", "nativeName": "தமிழ்", "flag": "🇮🇳"},
  {"code": "te", "name": "Telugu", "nativeName": "తెలుగు", "flag": "🇮🇳"},
  {"code": "mr", "name": "Marathi", "nativeName": "मराठी", "flag": "🇮🇳"},
  {"code": "gu", "name": "Gujarati", "nativeName": "ગુજરાતી", "flag": "🇮🇳"},
  {"code": "fr", "name": "French", "nativeName": "Français", "flag": "🇫🇷"},
  {"code": "de", "name": "German", "nativeName": "Deutsch", "flag": "🇩🇪"}
]
```

---

## 4. POST `/api/chat`

### Purpose
Main triage evaluation endpoint. Receives patient symptom input, session history, and language; invokes Google Gemma LLM; and returns structured JSON response.

### Request Body (`ChatRequestSchema`)
```json
{
  "sessionId": "session-1722160000",
  "text": "I have had a fever and severe headache for two days.",
  "languageCode": "en",
  "history": [
    {
      "id": "msg-1",
      "sender": "user",
      "text": "I have had a fever for two days.",
      "timestamp": "10:30 AM",
      "isVoiceInput": true
    }
  ],
  "summary": {
    "symptoms": ["Fever"],
    "duration": "2 days",
    "urgency": "Low",
    "recommendation": "Describe symptoms",
    "confidence": 85.0,
    "emergency": false
  }
}
```

### Response `200 OK` (`ChatResponseSchema`)
```json
{
  "assistantMessage": "Thank you for providing that detail. A high fever accompanied by severe headache requires clinical evaluation today. Are you experiencing neck stiffness or vomiting?",
  "healthSummary": {
    "symptoms": ["High Fever", "Severe Headache"],
    "duration": "2 days",
    "urgency": "High",
    "recommendation": "Visit an Urgent Care Center or Primary Physician today.",
    "confidence": 94.0,
    "emergency": false
  },
  "followUpQuestions": [
    "Are you experiencing neck stiffness?",
    "What is your highest measured body temperature?"
  ],
  "thoughtProcess": [
    "FastAPI Backend: Parsed symptom entities",
    "Google Gemma Engine: Evaluated risk level = HIGH",
    "Constructed targeted follow-up query"
  ]
}
```

---

## 5. POST `/api/session/new`

### Purpose
Initializes a new assessment session context and returns localized welcome prompt.

### Request Body (`StartSessionRequest`)
```json
{
  "languageCode": "hi"
}
```

### Response `200 OK`
```json
{
  "assistantMessage": "नमस्ते! मैं संजीवनी AI हूँ। आज आप किन लक्षणों का आकलन कराना चाहते हैं?",
  "healthSummary": {
    "symptoms": [],
    "duration": "",
    "urgency": "Low",
    "recommendation": "Describe your symptoms to receive initial triage guidance.",
    "confidence": 85.0,
    "emergency": false
  },
  "followUpQuestions": ["What is your primary symptom?"],
  "thoughtProcess": ["Session Initialized via FastAPI Backend"]
}
```

---

## 6. DELETE `/api/session/{session_id}`

### Purpose
Resets active conversation state for a specified session ID.

### Path Parameters
- `session_id` (string, required): Session ID to clear.

### Response `200 OK`
```json
{
  "status": "success",
  "sessionId": "session-1722160000",
  "message": "Session state cleared"
}
```

---

## 7. POST `/api/report`

### Purpose
Compiles conversation history and extracted health summary into a formal medical triage brief.

### Request Body (`ReportRequest`)
```json
{
  "sessionId": "session-1722160000",
  "history": [
    {
      "id": "msg-1",
      "sender": "user",
      "text": "High fever for two days.",
      "timestamp": "10:30 AM"
    }
  ],
  "summary": {
    "symptoms": ["Fever"],
    "duration": "2 days",
    "urgency": "Moderate",
    "recommendation": "Consult a General Physician within 24-48 hours.",
    "confidence": 91.5,
    "emergency": false
  },
  "patientAge": "28",
  "patientGender": "Female"
}
```

### Response `200 OK` (`ReportResponse`)
```json
{
  "sessionId": "session-1722160000",
  "reportId": "REP-A8F29C1B",
  "generatedAt": "2026-07-28 12:30:00 UTC",
  "summary": {
    "symptoms": ["Fever"],
    "duration": "2 days",
    "urgency": "Moderate",
    "recommendation": "Consult a General Physician within 24-48 hours.",
    "confidence": 91.5,
    "emergency": false
  },
  "physicianBrief": "Patient Age: 28 | Gender: Female\nTriage Urgency: MODERATE\nIdentified Symptoms: Fever (Duration: 2 days)\nCare Recommendation: Consult a General Physician within 24-48 hours.\nAI Confidence Score: 91.5%",
  "disclaimer": "This report is generated by Sanjeevani AI (Google Gemma Backend). It is intended solely as an initial triage assessment summary for licensed healthcare clinician review."
}
```

---

## 8. GET `/api/hospitals`

### Purpose
Finds nearby emergency rooms, urgent care centers, and specialty clinics.

### Query Parameters
- `query` (string, optional, default: `"General Emergency"`): Department or symptom query string.

### Response `200 OK` (`HospitalSearchResponse`)
```json
{
  "query": "General Emergency",
  "hospitals": [
    {
      "name": "City General Hospital & Emergency Center",
      "address": "124 Medical Center Drive, Suite 100",
      "distanceKm": 1.2,
      "phone": "+1 (555) 019-2831",
      "emergencyRoom": true
    },
    {
      "name": "St. Jude Urgent Care & Multi-Specialty Clinic",
      "address": "588 Health Plaza Boulevard",
      "distanceKm": 2.8,
      "phone": "+1 (555) 014-9920",
      "emergencyRoom": true
    }
  ]
}
```
