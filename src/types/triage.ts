export type UrgencyLevel = 'Low' | 'Moderate' | 'High' | 'Emergency';

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
  thoughtProcess?: string[];
}

export interface HealthSummary {
  symptoms: string[];
  duration: string;
  urgency: UrgencyLevel;
  recommendation: string;
  confidence: number; // e.g. 94.5
  emergency: boolean; // Emergency red flag indicator
}

export interface ApiResponse {
  assistantMessage: string;
  healthSummary: HealthSummary;
  followUpQuestions: string[];
  thoughtProcess?: string[];
}

export interface AssessmentSession {
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

export interface Report {
  session: AssessmentSession;
  generatedAt: string;
  physicianNotes?: string;
}

export interface ConversationState {
  activeSessionId: string;
  sessions: AssessmentSession[];
  isLoading: boolean;
  error: string | null;
  languageCode: string;
}
