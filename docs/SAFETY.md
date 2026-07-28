# Safety & Clinical Guardrails - Sanjeevani AI

> **Safety Architecture, Medical Disclaimer, and Red-Flag Protocols for Sanjeevani AI**

---

## ⚠️ Medical Disclaimer

> [!IMPORTANT]
> **Sanjeevani AI is strictly an informational health triage guidance system.** It is designed for educational purposes to help users articulate symptoms, understand urgency levels, and identify appropriate medical care pathways.
> 
> **SANJEEVANI AI DOES NOT:**
> - Provide formal medical diagnoses or clinical disease determinations.
> - Prescribe pharmaceutical medications, therapies, or specific treatment dosages.
> - Replace certified human physicians, nurses, or emergency healthcare providers.
> - Guarantee 100% diagnostic accuracy.
> 
> **IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, IMMEDIATELY CALL YOUR LOCAL EMERGENCY SERVICES (911 / 108) OR GO TO THE NEAREST HOSPITAL EMERGENCY ROOM.**

---

## 🎯 Intended Scope vs Non-Intended Scope

### ✅ Intended Scope
- **Symptom Structuring**: Helping users organize reported symptoms, age, and timeline into a readable format.
- **Urgency Stratification**: Classifying symptoms into general risk categories (`Low`, `Moderate`, `High`, `Emergency`) to help users decide between self-care, a general physician visit within 48 hours, urgent care, or emergency care.
- **Multilingual Accessibility**: Allowing non-English speakers to communicate symptoms in their native tongue.
- **Physician Summary Preparation**: Generating a printable PDF summary brief for users to share with their healthcare provider.

### ❌ Non-Intended Scope
- **Formal Diagnosis**: Asserting that a user has a specific condition (e.g. "You have Malaria" or "You have COVID-19").
- **Medication Management**: Recommending drug names, prescriptions, or therapeutic interventions.
- **Critical Care Triage Substitute**: Replacing emergency dispatch or professional paramedic evaluation.

---

## 🚨 Emergency Handling & Red-Flag Protocols

Sanjeevani AI employs a deterministic **Emergency Red-Flag Interceptor** in [`gemma_service.py`](file:///d:/FIFA/backend/app/services/gemma_service.py).

### Red-Flag Keywords Monitored
The system scans incoming text across languages for acute distress markers:
- **English**: `chest pain`, `cannot breathe`, `shortness of breath`, `unconscious`, `fainted`, `seizure`, `heavy bleeding`, `severe bleeding`
- **Hindi**: `सीने में दर्द`, `सांस नहीं ले`, `बेहोश`, `खून बह रहा`
- **Spanish**: `dolor de pecho`, `dificultad para respirar`

### Escalation Behavior
When a red-flag marker is detected:
1. **Safety Override**: Standard diagnostic prompts are bypassed.
2. **Urgency Hardening**: Urgency is forcibly set to `"Emergency"` and `emergency: true`.
3. **Red Alert UI Banner**: An animated, high-contrast emergency notification banner appears in the user interface.
4. **Immediate Recommendation**: The user is directed to call emergency services (911 / 108) or go to the nearest emergency department immediately.

---

## 🛡️ Backend Prompt Guardrails

In [`prompt_manager.py`](file:///d:/FIFA/backend/app/services/prompt_manager.py), Google Gemma is instructed with strict systemic constraints:

```text
CRITICAL CLINICAL BOUNDARIES & RULES:
1. NEVER diagnose medical conditions or diseases.
2. NEVER prescribe medications or treatments.
3. ASK FOLLOW-UP QUESTIONS if patient details are incomplete.
4. Classify urgency strictly into: "Low", "Moderate", "High", or "Emergency".
5. ALWAYS set "emergency": true if acute emergency markers are present.
6. RESPOND IN THE PATIENT'S LANGUAGE.
7. OUTPUT FORMAT: Return ONLY valid JSON adhering to the target schema.
```

---

## 🤖 AI Model Uncertainty & Potential Hallucination Risks

- **Model Nature**: Sanjeevani AI utilizes Google Gemma (`gemma-2-9b-it`), a large language model. LLMs can occasionally generate inaccurate, incomplete, or inappropriate outputs (hallucinations).
- **Confidence Scoring**: Each triage summary includes a confidence score (e.g., `92 font-percent`). Lower scores indicate higher ambiguity in the patient's symptom description.
- **JSON Auto-Repair**: Output JSON is parsed and validated using Pydantic schemas. If formatting errors occur, the backend executes automatic repair loops to prevent malformed UI states.

---

## 🎙️ Voice Recognition & Multilingual Limitations

- **Speech Recognition Errors**: Speech-to-text accuracy depends on ambient noise, microphone quality, and regional accents. Users are advised to review the populated text input field before submitting queries.
- **Language Nuances**: While 10 languages are supported, localized medical idioms may vary. The system encourages users to state symptoms simply and directly.

---

## 🔒 Privacy & Data Handling Precautions

- **Zero PII Collection**: Sanjeevani AI does not request or store full names, social security numbers, or addresses.
- **Session Memory Scope**: Chat history is maintained strictly during the active session.
- **HTTPS Enforcement**: Production deployments on Render and Vercel mandate SSL/TLS encryption for all data in transit.
