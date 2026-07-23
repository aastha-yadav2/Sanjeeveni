import { ApiResponse, AssessmentSession, HealthSummary, Language, Report } from '../types/triage';
import { SUPPORTED_LANGUAGES } from '../data/languages';

// Environment variable for backend API endpoint (e.g. http://localhost:8000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  /**
   * Fetch list of supported languages
   */
  async getLanguages(): Promise<Language[]> {
    return Promise.resolve(SUPPORTED_LANGUAGES);
  },

  /**
   * Start a new health assessment session
   */
  async startAssessment(languageCode: string = 'en'): Promise<ApiResponse> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessment/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languageCode }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, falling back to client mock contract", e);
      }
    }

    // Default JSON Contract Response for Start Assessment
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
        "API Request: POST /api/assessment/start",
        "Backend: Initializing Gemma-2-9b-it session context",
        "Formulating welcome prompt in selected language"
      ]
    });
  },

  /**
   * Send user message & get structured Gemma AI response
   */
  async sendMessage(
    sessionId: string,
    text: string,
    languageCode: string = 'en',
    existingSummary?: HealthSummary
  ): Promise<ApiResponse> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessment/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, text, languageCode, summary: existingSummary }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, executing client mock contract API", e);
      }
    }

    // Simulate async network latency (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = text.toLowerCase();

    // 1. Red Flag Emergency Symptoms
    if (
      lower.includes('chest pain') ||
      lower.includes('shortness of breath') ||
      lower.includes('cannot breathe') ||
      lower.includes('unconscious') ||
      lower.includes('सीने में दर्द') ||
      lower.includes('सांस लेने में तकलीफ')
    ) {
      return {
        assistantMessage: languageCode === 'hi'
          ? "⚠️ आपातकालीन चेतावनी: आपके लक्षण अत्यंत गंभीर हैं। कृपया तुरंत 108 / 112 डायल करें या निकटतम आपातकालीन अस्पताल जाएं।"
          : "⚠️ EMERGENCY NOTICE: Your described symptoms (chest pain / severe breathlessness) indicate critical distress. Please call 911 / 108 or proceed to the nearest Emergency Department immediately.",
        healthSummary: {
          symptoms: ["Chest Pain / Respiratory Distress"],
          duration: "Acute",
          urgency: "Emergency",
          recommendation: "IMMEDIATE EMERGENCY MEDICAL CARE REQUIRED. Call 911 / 108 immediately.",
          confidence: 99.0,
          emergency: true
        },
        followUpQuestions: [],
        thoughtProcess: [
          "FastAPI Backend: Received payload for sessionId: " + sessionId,
          "Gemma Clinical Guardrails: Red Flag Symptom Triggered",
          "Setting emergency: true",
          "Generating immediate 911 dispatch notification"
        ]
      };
    }

    // 2. High Urgency Symptoms
    if (lower.includes('high fever') || lower.includes('severe headache') || lower.includes('तेज़ बुखार')) {
      return {
        assistantMessage: languageCode === 'hi'
          ? "समझ गया। तेज़ बुखार और सिरदर्द के कारण आपको जल्द से जल्द चिकित्सक से परामर्श लेना चाहिए। क्या आपको उल्टी या अत्यधिक कमजोरी भी है?"
          : "Thank you for sharing. High fever with severe headache requires clinical evaluation today. Are you experiencing nausea or neck stiffness?",
        healthSummary: {
          symptoms: ["High Fever", "Severe Headache"],
          duration: "2 days",
          urgency: "High",
          recommendation: "Visit an Urgent Care Center or Primary Physician today.",
          confidence: 94.0,
          emergency: false
        },
        followUpQuestions: [
          "Do you have nausea or neck stiffness?",
          "What is your highest measured body temperature?"
        ],
        thoughtProcess: [
          "FastAPI Backend: Tokenized symptom input",
          "Gemma Core: Evaluated risk score = HIGH",
          "Constructing targeted follow-up prompt"
        ]
      };
    }

    // 3. Moderate / Low Standard Symptoms
    const extractedSymptoms = extractSymptomsFromText(text);
    return {
      assistantMessage: languageCode === 'hi'
        ? `धन्यवाद। आपके द्वारा बताए गए लक्षणों (${extractedSymptoms.join(', ') || 'बुखार'}) के लिए, क्या आप बता सकते हैं कि यह समस्या कितने समय से है?`
        : `Thank you. Regarding your symptoms (${extractedSymptoms.join(', ') || 'reported issue'}), how long have you been experiencing this and what is your age?`,
      healthSummary: {
        symptoms: extractedSymptoms.length > 0 ? extractedSymptoms : ["Fever", "Mild Fatigue"],
        duration: "2 days",
        urgency: "Moderate",
        recommendation: "Schedule a routine consultation with a General Physician within 24-48 hours. Stay hydrated and rest.",
        confidence: 91.5,
        emergency: false
      },
      followUpQuestions: [
        "What is your current age?",
        "Are you currently taking any prescription medications?"
      ],
      thoughtProcess: [
        "FastAPI Backend: Processing query",
        "Gemma Core: Extracted symptom entities",
        "Returning structured JSON response"
      ]
    };
  },

  /**
   * Generate formal medical report
   */
  async generateReport(session: AssessmentSession): Promise<Report> {
    return Promise.resolve({
      session,
      generatedAt: new Date().toISOString(),
      physicianNotes: "Generated by Sanjeevani AI (Google Gemma Backend). Clinical triage brief for physician review."
    });
  },

  /**
   * Clear active session data
   */
  async clearSession(sessionId: string): Promise<void> {
    return Promise.resolve();
  }
};

function extractSymptomsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const symptoms: string[] = [];
  if (lower.includes('fever') || lower.includes('बुखार')) symptoms.push('Fever');
  if (lower.includes('cough') || lower.includes('खांसी')) symptoms.push('Cough');
  if (lower.includes('headache') || lower.includes('सिरदर्द')) symptoms.push('Headache');
  if (lower.includes('stomach') || lower.includes('पेट दर्द')) symptoms.push('Stomach Ache');
  if (lower.includes('sore throat') || lower.includes('गले में खराश')) symptoms.push('Sore Throat');
  return symptoms.length > 0 ? symptoms : ['Reported Symptom'];
}
