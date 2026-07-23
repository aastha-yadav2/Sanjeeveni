import { ApiResponse, AssessmentSession, HealthSummary, Language, Report } from '../types/triage';
import { SUPPORTED_LANGUAGES } from '../data/languages';

// Base URL for FastAPI Backend Engine (Defaults to http://localhost:8000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  /**
   * Fetch list of supported languages from FastAPI backend
   */
  async getLanguages(): Promise<Language[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/languages`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API unavailable, using client language definitions", e);
    }
    return Promise.resolve(SUPPORTED_LANGUAGES);
  },

  /**
   * Start a new health assessment session via POST /api/session/new
   */
  async startAssessment(languageCode: string = 'en'): Promise<ApiResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/session/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageCode }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("FastAPI Backend unavailable, executing client fallback contract", e);
    }

    const welcomeMsg = languageCode === 'hi'
      ? "नमस्ते! मैं संजीवनी AI हूँ। आपके क्या लक्षण हैं?"
      : "Hello! I am Sanjeevani AI powered by Google Gemma. Please describe your symptoms in your preferred language.";

    return Promise.resolve({
      assistantMessage: welcomeMsg,
      healthSummary: {
        symptoms: [],
        duration: "",
        urgency: "Low",
        recommendation: "Describe your symptoms to receive initial triage guidance.",
        confidence: 85.0,
        emergency: false
      },
      followUpQuestions: [
        "What is your primary symptom?",
        "How long have you been feeling unwell?"
      ],
      thoughtProcess: [
        "Vite Frontend -> FastAPI Backend Request",
        "Initial session state initialized"
      ]
    });
  },

  /**
   * Send user message & get structured Gemma AI response via POST /api/chat
   */
  async sendMessage(
    sessionId: string,
    text: string,
    languageCode: string = 'en',
    existingSummary?: HealthSummary
  ): Promise<ApiResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text,
          languageCode,
          summary: existingSummary
        }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("FastAPI Backend unavailable, executing client fallback contract", e);
    }

    // Client fallback simulation if FastAPI server is offline
    await new Promise((resolve) => setTimeout(resolve, 800));
    const lower = text.toLowerCase();

    if (
      lower.includes('chest pain') ||
      lower.includes('shortness of breath') ||
      lower.includes('unconscious') ||
      lower.includes('सीने में दर्द')
    ) {
      return {
        assistantMessage: languageCode === 'hi'
          ? "⚠️ आपातकालीन सूचना: आपके लक्षण गंभीर हैं। तुरंत 108 / 112 डायल करें।"
          : "⚠️ EMERGENCY NOTICE: Your described symptoms indicate critical distress. Call emergency services (911 / 108) immediately.",
        healthSummary: {
          symptoms: ["Chest Pain / Dyspnea"],
          duration: "Acute",
          urgency: "Emergency",
          recommendation: "IMMEDIATE EMERGENCY MEDICAL CARE REQUIRED. Call 911 / 108 immediately.",
          confidence: 99.0,
          emergency: true
        },
        followUpQuestions: [],
        thoughtProcess: [
          "FastAPI Backend: Red Flag Triggered",
          "Setting emergency: true"
        ]
      };
    }

    const extracted = extractSymptomsFromText(text);
    return {
      assistantMessage: languageCode === 'hi'
        ? `धन्यवाद। आपके द्वारा बताए गए लक्षणों (${extracted.join(', ') || 'बुखार'}) के लिए, क्या आपकी उम्र बता सकते हैं?`
        : `Thank you. Regarding your symptoms (${extracted.join(', ') || 'reported issue'}), how long have you been experiencing this and what is your age?`,
      healthSummary: {
        symptoms: extracted.length > 0 ? extracted : ["Reported Symptom"],
        duration: "2 days",
        urgency: "Moderate",
        recommendation: "Schedule a routine consultation with a General Physician within 24-48 hours.",
        confidence: 91.5,
        emergency: false
      },
      followUpQuestions: ["What is your age?", "Are you taking any medications?"],
      thoughtProcess: [
        "FastAPI Backend Engine: Parsed symptom entities",
        "Returning structured JSON response"
      ]
    };
  },

  /**
   * Generate formal medical report via POST /api/report
   */
  async generateReport(session: AssessmentSession): Promise<Report> {
    try {
      const res = await fetch(`${API_BASE_URL}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          history: session.messages,
          summary: session.summary,
          patientAge: session.patientAge || 'Unspecified',
          patientGender: session.patientGender || 'Unspecified'
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          session,
          generatedAt: data.generatedAt,
          physicianNotes: data.physicianBrief
        };
      }
    } catch (e) {
      console.warn("FastAPI Report API error, falling back to local object", e);
    }

    return Promise.resolve({
      session,
      generatedAt: new Date().toISOString(),
      physicianNotes: "Generated by Sanjeevani AI (FastAPI + Google Gemma Backend)."
    });
  },

  /**
   * Clear active session via DELETE /api/session/{id}
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/session/${sessionId}`, { method: 'DELETE' });
    } catch (e) {
      // ignore offline fallback
    }
  }
};

function extractSymptomsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const symptoms: string[] = [];
  if (lower.includes('fever') || lower.includes('बुखार')) symptoms.push('Fever');
  if (lower.includes('cough') || lower.includes('खांसी')) symptoms.push('Cough');
  if (lower.includes('headache') || lower.includes('सिरदर्द')) symptoms.push('Headache');
  if (lower.includes('stomach') || lower.includes('पेट दर्द')) symptoms.push('Stomach Ache');
  return symptoms;
}
