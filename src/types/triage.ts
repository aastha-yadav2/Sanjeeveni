export type UrgencyLevel = 'low' | 'moderate' | 'high' | 'emergency';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemma';
  text: string;
  timestamp: string;
  languageCode?: string;
  urgencyLevel?: UrgencyLevel;
  isVoiceInput?: boolean;
  thoughtProcess?: string[]; // Gemma AI reasoning steps
}

export interface HealthSummary {
  symptoms: string[];
  duration: string;
  urgency: UrgencyLevel;
  recommendation: string;
  emergencyStatus: boolean;
  confidence: number; // Percentage (e.g., 94%)
  suggestedDepartment: string;
  followUpQuestionsAsked: number;
}

export interface TriageSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  languageCode: string;
  messages: ChatMessage[];
  summary: HealthSummary;
  patientAge?: string;
  patientGender?: string;
}
