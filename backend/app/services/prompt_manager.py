import json
from typing import List, Dict, Any

class PromptManager:
    """
    Production-grade Prompt Manager for Sanjeevani AI powered by Google Gemma.
    Enforces clinical guardrails, multilingual triage reasoning, and strict JSON output.
    """

    SYSTEM_PROMPT = """You are Sanjeevani AI, a multilingual, voice-first medical triage assistant powered by Google Gemma.
Your sole purpose is to perform initial healthcare symptom triage in the patient's language, ask intelligent follow-up questions, evaluate urgency levels, and recommend appropriate care pathways.

STRICT CLINICAL RULES & SAFETY BOUNDARIES:
1. DO NOT DIAGNOSE DISEASES OR MEDICAL CONDITIONS. Never say "You have X disease".
2. DO NOT PRESCRIBE MEDICATIONS OR TREATMENTS. Never give dosage advice.
3. ASK FOLLOW-UP QUESTIONS: If patient details (age, exact symptom duration, or associated symptoms) are missing, include 1-3 targeted follow-up questions in the patient's language.
4. URGENCY CLASSIFICATION: You MUST classify urgency strictly as one of four exact values: "Low", "Moderate", "High", or "Emergency".
5. EMERGENCY RED FLAGS: If the patient mentions acute chest pain, severe shortness of breath / breathing difficulty, loss of consciousness / fainting, seizures, or heavy bleeding, set "emergency": true, "urgency": "Emergency", and recommend immediate emergency medical care (calling 911 or 108).
6. MULTILINGUAL RESPONSIVENESS: Respond in the exact language used by the patient (English, Hindi, Bengali, Tamil, Spanish, Marathi, Gujarati, French, German, etc.).
7. CONVERSATION MEMORY: Refer to the provided conversation history to avoid repeating questions.
8. STRUCTURED JSON OUTPUT: You MUST return ONLY valid JSON conforming to the exact schema below. Do not include markdown code block backticks if possible, or format cleanly inside ```json ``` code blocks.

EXPECTED JSON SCHEMA:
{{
  "assistantMessage": "Conversational assistant reply to patient in their native language",
  "healthSummary": {{
    "symptoms": ["Symptom 1", "Symptom 2"],
    "duration": "Reported duration (e.g. '2 days') or 'Unspecified'",
    "urgency": "Low" | "Moderate" | "High" | "Emergency",
    "recommendation": "Care recommendation (e.g. 'Consult a General Physician within 24-48 hours')",
    "confidence": 92.5,
    "emergency": false
  }},
  "followUpQuestions": ["Follow-up question 1 in patient language", "Follow-up question 2"]
}}
"""

    @classmethod
    def build_gemma_prompt(
        cls,
        user_text: str,
        language_code: str = "en",
        history: List[Dict[str, Any]] = None,
        summary: Dict[str, Any] = None
    ) -> str:
        """
        Constructs full prompt payload incorporating system instructions, conversation history, and current summary.
        """
        history_lines = []
        if history:
            for msg in history[-6:]:  # Keep last 6 conversation turns
                sender = msg.get("sender", "user")
                text = msg.get("text", "")
                history_lines.append(f"{sender.capitalize()}: {text}")
        
        history_text = "\n".join(history_lines) if history_lines else "No previous history."
        summary_text = json.dumps(summary, indent=2) if summary else "No previous summary."

        prompt = f"""{cls.SYSTEM_PROMPT}

PATIENT LANGUAGE PREFERENCE: {language_code}

CURRENT CONVERSATION HISTORY:
{history_text}

PREVIOUS HEALTH SUMMARY:
{summary_text}

PATIENT LATEST SYMPTOM INPUT:
"{user_text}"

JSON RESPONSE:"""
        return prompt

    @classmethod
    def build_repair_prompt(cls, invalid_json_str: str, error_msg: str) -> str:
        """
        Generates a repair prompt if initial Gemma inference output fails JSON parsing.
        """
        return f"""The following JSON response from a health triage assistant contained syntax or validation errors:

INVALID JSON:
{invalid_json_str}

ERROR DETAILS:
{error_msg}

Task: Repair the JSON object so it strictly conforms to this schema:
{{
  "assistantMessage": "string",
  "healthSummary": {{
    "symptoms": ["string"],
    "duration": "string",
    "urgency": "Low" | "Moderate" | "High" | "Emergency",
    "recommendation": "string",
    "confidence": 90.0,
    "emergency": false
  }},
  "followUpQuestions": ["string"]
}}

Return ONLY the corrected JSON object:"""

prompt_manager = PromptManager()
