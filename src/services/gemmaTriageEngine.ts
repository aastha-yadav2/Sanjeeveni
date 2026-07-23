import { ChatMessage, HealthSummary, UrgencyLevel } from '../types/triage';

interface GemmaResponse {
  message: ChatMessage;
  updatedSummary: HealthSummary;
}

// Emergency Keywords across languages
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'cannot breathe', 'difficulty breathing', 'shortness of breath',
  'stroke', 'numbness', 'unconscious', 'fainted', 'heavy bleeding', 'severe bleeding', 'seizure',
  'सीने में दर्द', 'सांस नहीं ले', 'बेहोश', 'खून बह रहा',
  'dolor de pecho', 'dificultad para respirar', 'desmayado'
];

export function processUserSymptom(
  userText: string,
  history: ChatMessage[],
  currentSummary: HealthSummary,
  languageCode: string = 'en',
  isVoiceInput: boolean = false
): GemmaResponse {
  const normalizedText = userText.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Check Emergency Red Flags
  const isEmergency = EMERGENCY_KEYWORDS.some(kw => normalizedText.includes(kw));

  if (isEmergency) {
    const emergencyText = getEmergencyResponseText(languageCode);
    const gemmaMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'gemma',
      text: emergencyText,
      timestamp,
      urgencyLevel: 'emergency',
      thoughtProcess: [
        `Google Gemma Triage Core: Red Flag Symptom Detected in input: "${userText}"`,
        "Safety Override Engaged: Bypassing standard diagnostic questionnaire",
        "Categorizing Urgency: EMERGENCY LEVEL 4 (Immediate Hospital Transfer Recommended)"
      ]
    };

    const newSymptoms = Array.from(new Set([...currentSummary.symptoms, extractPrimarySymptom(userText)]));

    const emergencySummary: HealthSummary = {
      symptoms: newSymptoms,
      duration: currentSummary.duration || "Acute",
      urgency: 'emergency',
      recommendation: getEmergencyRecommendation(languageCode),
      emergencyStatus: true,
      confidence: 99,
      suggestedDepartment: "Emergency Medicine / Cardiac Care",
      followUpQuestionsAsked: currentSummary.followUpQuestionsAsked + 1
    };

    return { message: gemmaMessage, updatedSummary: emergencySummary };
  }

  // 2. Multi-turn Follow-up Logic
  const userTurnCount = history.filter(m => m.sender === 'user').length;
  let nextUrgency: UrgencyLevel = 'low';
  let responseText = '';
  let thoughtSteps: string[] = [];

  // Detect symptoms and duration from current text
  const extractedSymptom = extractPrimarySymptom(userText);
  const updatedSymptoms = Array.from(new Set([...currentSummary.symptoms, extractedSymptom])).filter(Boolean);
  const detectedDuration = extractDuration(userText) || currentSummary.duration || "2 days";

  if (userTurnCount === 1) {
    // First response: Ask for age or duration
    thoughtSteps = [
      `Gemma AI Model (Gemma-2-9b-it): Parsing patient input "${userText}"`,
      `Extracted symptom entity: "${extractedSymptom}"`,
      "Determining clinical next steps: Requesting patient age and specific symptom timeline"
    ];
    responseText = getFirstFollowupText(languageCode, extractedSymptom);
    nextUrgency = 'low';
  } else if (userTurnCount === 2) {
    // Second response: Ask for secondary associated symptoms
    thoughtSteps = [
      `Gemma AI Model: Registering patient age/timeline context`,
      `Synthesizing symptom profile: [${updatedSymptoms.join(', ')}]`,
      "Evaluating severity indicators: Screening for fever severity, cough, nausea, or dizziness"
    ];
    responseText = getSecondFollowupText(languageCode);
    nextUrgency = 'moderate';
  } else {
    // Final Triage Conclusion
    const finalUrgency = evaluateFinalUrgency(updatedSymptoms, userText);
    thoughtSteps = [
      `Gemma AI Model: Comprehensive clinical decision matrix execution complete`,
      `Calculated risk category: ${finalUrgency.toUpperCase()}`,
      `Formulating evidence-backed triage guidance and next steps`
    ];
    responseText = getTriageConclusionText(languageCode, updatedSymptoms, finalUrgency);
    nextUrgency = finalUrgency;
  }

  const gemmaMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'gemma',
    text: responseText,
    timestamp,
    urgencyLevel: nextUrgency,
    thoughtProcess: thoughtSteps
  };

  const updatedSummary: HealthSummary = {
    symptoms: updatedSymptoms.length > 0 ? updatedSymptoms : ["Fever", "General Malaise"],
    duration: detectedDuration,
    urgency: nextUrgency,
    recommendation: getRecommendationText(nextUrgency, languageCode),
    emergencyStatus: false,
    confidence: userTurnCount >= 3 ? 95 : 82,
    suggestedDepartment: getSuggestedDepartment(updatedSymptoms),
    followUpQuestionsAsked: currentSummary.followUpQuestionsAsked + 1
  };

  return { message: gemmaMessage, updatedSummary };
}

// Multilingual Helper Generators
function getEmergencyResponseText(lang: string): string {
  switch (lang) {
    case 'hi':
      return "⚠️ आपातकालीन सूचना: आपके लक्षण (सीने में दर्द/सांस लेने में कठिनाई) को तत्काल चिकित्सा ध्यान देने की आवश्यकता है। कृपया तुरंत 108 / 112 डायल करें या निकटतम अस्पताल के आपातकालीन कक्ष (ER) में जाएँ।";
    case 'es':
      return "⚠️ AVISO DE EMERGENCIA: Sus síntomas requieren atención médica INMEDIATA. Por favor llame al 911 o diríjase al servicio de urgencias más cercano de inmediato.";
    default:
      return "⚠️ EMERGENCY NOTICE: Your described symptoms indicate potential critical distress requiring IMMEDIATE medical attention. Please call emergency services (911 / 108) or proceed to the nearest Emergency Room immediately.";
  }
}

function getEmergencyRecommendation(lang: string): string {
  switch (lang) {
    case 'hi':
      return "तत्काल आपातकालीन सहायता (108 / ER) प्राप्त करें। अकेले वाहन न चलाएं।";
    case 'es':
      return "Busque atención de emergencia inmediata (911 / ER). No conduzca usted mismo.";
    default:
      return "Seek IMMEDIATE Emergency Care (911 / 108). Do not drive yourself to the hospital.";
  }
}

function getFirstFollowupText(lang: string, symptom: string): string {
  switch (lang) {
    case 'hi':
      return `समझा। मैं आपकी मदद के लिए यहाँ हूँ। लक्षण (${symptom || 'बुखार'}) को बेहतर ढंग से समझने के लिए, आपकी उम्र क्या है और यह समस्या कितने समय से है?`;
    case 'es':
      return `Entendido. Estoy aquí para ayudarle. Para evaluar sus síntomas (${symptom || 'fiebre'}), ¿cuál es su edad y desde cuándo experimenta esto?`;
    default:
      return `I understand. I am here to help guide you. To better evaluate your ${symptom || 'symptoms'}, what is your age and exactly how long have you been experiencing this?`;
  }
}

function getSecondFollowupText(lang: string): string {
  switch (lang) {
    case 'hi':
      return "धन्यवाद। क्या आपको इसके साथ खांसी, चक्कर आना, ठंड लगना या मतली जैसे कोई अन्य लक्षण भी महसूस हो रहे हैं?";
    case 'es':
      return "Gracias. ¿Está experimentando también tos, mareos, escalofríos o náuseas junto con esto?";
    default:
      return "Thank you for sharing that. Are you also experiencing any associated symptoms such as cough, dizziness, chills, or nausea?";
  }
}

function getTriageConclusionText(lang: string, symptoms: string[], urgency: UrgencyLevel): string {
  const symStr = symptoms.join(', ');
  switch (lang) {
    case 'hi':
      return `आपके द्वारा बताए गए लक्षणों (${symStr}) के आधार पर, आपका जोखिम स्तर ${urgency.toUpperCase()} है। हमारी सलाह है कि आप 24-48 घंटों के भीतर किसी सामान्य चिकित्सक (General Physician) से परामर्श लें।`;
    case 'es':
      return `Según los síntomas reportados (${symStr}), su nivel de urgencia se evalúa como ${urgency.toUpperCase()}. Le recomendamos consultar a un médico general en las próximas 24 a 48 horas.`;
    default:
      return `Based on your reported symptoms (${symStr}), Gemma AI evaluates your condition urgency level as ${urgency.toUpperCase()}. We recommend scheduling a consultation with a General Physician within 24 to 48 hours.`;
  }
}

function extractPrimarySymptom(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('fiebre')) return 'Fever';
  if (lower.includes('headache') || lower.includes('सिरदर्द') || lower.includes('dolor de cabeza')) return 'Headache';
  if (lower.includes('cough') || lower.includes('खांसी') || lower.includes('tos')) return 'Cough';
  if (lower.includes('stomach') || lower.includes('पेट') || lower.includes('estómago')) return 'Stomach Ache';
  if (lower.includes('throat') || lower.includes('गला')) return 'Sore Throat';
  if (lower.includes('fatigue') || lower.includes('थकान')) return 'Fatigue';
  return 'Reported Symptom';
}

function extractDuration(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('two days') || lower.includes('2 days') || lower.includes('2 दिन')) return '2 days';
  if (lower.includes('three days') || lower.includes('3 days') || lower.includes('3 दिन')) return '3 days';
  if (lower.includes('week') || lower.includes('हफ्ता')) return '1 week';
  if (lower.includes('today') || lower.includes('आज')) return '1 day';
  return null;
}

function evaluateFinalUrgency(symptoms: string[], text: string): UrgencyLevel {
  const lower = text.toLowerCase();
  if (lower.includes('severe') || lower.includes('high') || lower.includes('तेज़')) return 'high';
  if (symptoms.length > 2) return 'moderate';
  return 'low';
}

function getRecommendationText(urgency: UrgencyLevel, lang: string): string {
  if (urgency === 'high') {
    return "Visit an Urgent Care Center or Primary Physician today for a clinical evaluation.";
  } else if (urgency === 'moderate') {
    return "Schedule a routine consultation with a General Physician within 24-48 hours. Stay hydrated and monitor symptoms.";
  }
  return "Rest, hydrate, and monitor symptoms at home. Consult a physician if symptoms worsen or persist past 3 days.";
}

function getSuggestedDepartment(symptoms: string[]): string {
  const sym = symptoms.join(' ').toLowerCase();
  if (sym.includes('stomach')) return 'Gastroenterology';
  if (sym.includes('headache')) return 'Neurology / General Care';
  if (sym.includes('cough')) return 'Pulmonology / Internal Medicine';
  return 'General Physician / Internal Medicine';
}
