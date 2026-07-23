import { AssessmentSession } from '../types/triage';

export const INITIAL_SAMPLE_CHIPS = [
  "High fever for two days",
  "Severe headache & dizziness",
  "Cough, sore throat & mild fatigue",
  "Sharp stomach pain after eating",
  "Shortness of breath and chest tightness"
];

export const SAMPLE_TRIAGE_SESSIONS: AssessmentSession[] = [
  {
    id: "session-001",
    title: "High Fever & Fatigue Triage",
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
        text: "I understand. I am here to assist with your health triage. What is your age and are you experiencing any difficulty breathing?",
        timestamp: "10:30 AM",
        thoughtProcess: [
          "FastAPI Backend: Incoming payload for session-001",
          "Gemma Engine: Extracted symptom 'Fever (2 days)'",
          "Constructing targeted follow-up query"
        ]
      },
      {
        id: "m-3",
        sender: "user",
        text: "I am 28 years old with mild cough, but no difficulty breathing.",
        timestamp: "10:32 AM"
      },
      {
        id: "m-4",
        sender: "gemma",
        text: "Based on your reported symptoms (Fever for 2 days, mild cough in a 28-year-old), your triage urgency is MODERATE. We recommend consulting a General Physician within 24 to 48 hours.",
        timestamp: "10:35 AM",
        urgencyLevel: "Moderate",
        thoughtProcess: [
          "FastAPI Backend: Updated session risk evaluation",
          "Gemma Engine: Absence of red-flag dyspnea",
          "Calculated Urgency: Moderate"
        ]
      }
    ],
    summary: {
      symptoms: ["Fever", "Mild Cough"],
      duration: "2 days",
      urgency: "Moderate",
      recommendation: "Schedule a routine consultation with a General Physician within 24-48 hours. Stay hydrated and rest.",
      confidence: 94.0,
      emergency: false
    }
  }
];
