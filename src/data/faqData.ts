export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'gemma' | 'privacy' | 'safety';
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "What is Sanjeevani AI and how does it work?",
    answer: "Sanjeevani AI is a voice-first, multilingual health triage assistant powered by Google Gemma. It helps you articulate symptoms in your preferred language, asks relevant follow-up questions, assesses urgency, and provides guidance on the appropriate medical care step. It does not provide medical diagnoses or prescriptions.",
    category: "general"
  },
  {
    question: "Is Sanjeevani AI a replacement for a doctor?",
    answer: "No. Sanjeevani AI is strictly an educational triage assessment tool designed to help you understand the urgency of your symptoms. Always seek advice from a certified medical professional or emergency medical services for actual diagnosis and treatment.",
    category: "safety"
  },
  {
    question: "How does Google Gemma power Sanjeevani AI?",
    answer: "Sanjeevani AI utilizes specialized, lightweight fine-tuned Google Gemma models optimized for clinical triage decision trees and natural multilingual dialogue processing. Gemma ensures low latency, localized language accuracy, and privacy-preserving clinical reasoning.",
    category: "gemma"
  },
  {
    question: "How is my personal health data protected?",
    answer: "We prioritize user privacy above all. Sanjeevani AI does not store sensitive personal identifiers, sell user conversation history, or track your location without consent. All assessment data remains encrypted and stored locally in your browser during your session.",
    category: "privacy"
  },
  {
    question: "What languages are currently supported?",
    answer: "Sanjeevani AI natively supports English, Hindi (हिन्दी), Spanish (Español), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati (ગુજરાતી), French (Français), and German (Deutsch) with expanding voice recognition.",
    category: "general"
  },
  {
    question: "How does Sanjeevani AI handle medical emergencies?",
    answer: "If our triage engine detects high-risk emergency markers (such as severe chest pain, loss of consciousness, or extreme difficulty breathing), it instantly triggers a red alert notification urging the user to contact emergency services (like 911 / 108) immediately.",
    category: "safety"
  }
];
