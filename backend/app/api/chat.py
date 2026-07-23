from fastapi import APIRouter, HTTPException, status
from app.models.schemas import ChatRequestSchema, ChatResponseSchema, StartSessionRequest
from app.services.gemma_service import gemma_service

router = APIRouter(prefix="/api", tags=["Chat & Triage"])

@router.post(
    "/chat",
    response_model=ChatResponseSchema,
    summary="Process patient symptom input via Google Gemma LLM",
    description="Main triage endpoint. Accepts patient text input, session history, and language; returns structured JSON response."
)
async def process_chat(request: ChatRequestSchema):
    try:
        history_dicts = [m.model_dump() for m in request.history] if request.history else []
        summary_dict = request.summary.model_dump() if request.summary else None

        response = await gemma_service.generate_triage_response(
            user_text=request.text,
            language_code=request.languageCode or "en",
            history=history_dicts,
            summary=summary_dict
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing triage query: {str(e)}"
        )

@router.post(
    "/session/new",
    response_model=ChatResponseSchema,
    summary="Initialize new health assessment session",
    description="Creates a new session context and returns localized welcome prompt."
)
async def create_session(request: StartSessionRequest):
    welcome_text = "Hello! I am Sanjeevani AI. What symptoms would you like to assess today?"
    if request.languageCode == "hi":
        welcome_text = "नमस्ते! मैं संजीवनी AI हूँ। आज आप किन लक्षणों का आकलन कराना चाहते हैं?"

    return ChatResponseSchema(
        assistantMessage=welcome_text,
        healthSummary={
            "symptoms": [],
            "duration": "",
            "urgency": "Low",
            "recommendation": "Describe your symptoms to receive initial triage guidance.",
            "confidence": 85.0,
            "emergency": False
        },
        followUpQuestions=["What is your primary symptom?"],
        thoughtProcess=["Session Initialized via FastAPI Backend"]
    )

@router.delete(
    "/session/{session_id}",
    summary="Clear active triage session",
    description="Resets active conversation state."
)
async def clear_session(session_id: str):
    return {"status": "success", "sessionId": session_id, "message": "Session state cleared"}
