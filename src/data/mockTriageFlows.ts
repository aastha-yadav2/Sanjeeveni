import { TriageSession } from '../types/triage';

export const INITIAL_SAMPLE_CHIPS = [
  "I have had a high fever for two days",
  "Severe headache and dizziness",
  "Cough, sore throat & mild fatigue",
  "Sharp stomach ache after meals",
  "Difficulty breathing and chest tightness"
];

export const INITIAL_HINDI_CHIPS = [
  "मुझे 2 दिनों से तेज़ बुखार है",
  "सिरदर्द और चक्कर आ रहे हैं",
  "खांसी और गले में खराश",
  "खाने के बाद पेट में तेज दर्द"
];

export const SAMPLE_TRIAGE_SESSIONS: TriageSession[] = [
  {
    id: "session-001",
    title: "High Fever & Fatigue Assessment",
    createdAt: "2026-07-23T10:30:00Z",
    updatedAt: "2026-07-23T10:35:00Z",
    languageCode: "en",
    patientAge: "28",
    patientGender: "Female",
    messages: [
      {
        id: "m-1",
        sender: "user",
        text: "I have had fever for two days.",
        timestamp: "10:30 AM",
        isVoiceInput: true
      },
      {
        id: "m-2",
        sender: "gemma",
        text: "I understand. I am here to help you evaluate your symptoms. What is your age?",
        timestamp: "10:30 AM",
        thoughtProcess: ["Parsing symptom: Fever", "Extracting duration: 2 days", "Formulating follow-up: Age check for risk stratification"]
      },
      {
        id: "m-3",
        sender: "user",
        text: "I am 28 years old.",
        timestamp: "10:31 AM"
      },
      {
        id: "m-4",
        sender: "gemma",
        text: "Thank you. Are you experiencing a cough, chills, or difficulty breathing along with the fever?",
        timestamp: "10:32 AM",
        thoughtProcess: ["Recording age: 28", "Evaluating respiratory risk factors", "Formulating follow-up: Associated symptom screening"]
      },
      {
        id: "m-5",
        sender: "user",
        text: "Yes, mild cough and body aches, but no difficulty breathing.",
        timestamp: "10:33 AM"
      },
      {
        id: "m-6",
        sender: "gemma",
        text: "Based on your reported symptoms (Fever for 2 days, mild cough, body aches in a 28-year-old), your urgency is MODERATE. We recommend consulting a General Physician within 24 to 48 hours for clinical evaluation.",
        timestamp: "10:35 AM",
        urgencyLevel: "moderate",
        thoughtProcess: ["Aggregating reported data", "Absence of red-flag dyspnea", "Categorizing urgency: Moderate", "Generating care recommendation"]
      }
    ],
    summary: {
      symptoms: ["Fever", "Mild Cough", "Body Aches"],
      duration: "2 days",
      urgency: "moderate",
      recommendation: "Schedule a routine consultation with a General Physician within 24-48 hours. Stay hydrated, rest, and monitor temperature.",
      emergencyStatus: false,
      confidence: 94,
      suggestedDepartment: "General Internal Medicine",
      followUpQuestionsAsked: 3
    }
  },
  {
    id: "session-002",
    title: "Severe Chest Tightness Assessment",
    createdAt: "2026-07-22T14:15:00Z",
    updatedAt: "2026-07-22T14:18:00Z",
    languageCode: "en",
    patientAge: "54",
    patientGender: "Male",
    messages: [
      {
        id: "m-201",
        sender: "user",
        text: "I have sharp chest pain and feel shortness of breath.",
        timestamp: "02:15 PM"
      },
      {
        id: "m-202",
        sender: "gemma",
        text: "⚠️ EMERGENCY NOTICE: Your symptoms (chest pain with shortness of breath) require IMMEDIATE medical evaluation. Please call emergency services (911 / 108) or go to the nearest Emergency Department immediately.",
        timestamp: "02:15 PM",
        urgencyLevel: "emergency",
        thoughtProcess: ["RED FLAG DETECTED: Acute Chest Pain + Shortness of Breath", "Bypassing standard questions", "Triggering Immediate Emergency Protocol"]
      }
    ],
    summary: {
      symptoms: ["Sharp Chest Pain", "Shortness of Breath"],
      duration: "< 1 hour",
      urgency: "emergency",
      recommendation: "IMMEDIATE EMERGENCY CARE REQUIRED. Call 911 / 108 or have someone drive you to the nearest hospital Emergency Room now.",
      emergencyStatus: true,
      confidence: 99,
      suggestedDepartment: "Emergency Medicine / Cardiology",
      followUpQuestionsAsked: 0
    }
  }
];
