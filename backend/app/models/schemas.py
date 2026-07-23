from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class UrgencyLevelEnum(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    EMERGENCY = "Emergency"

class HealthSummarySchema(BaseModel):
    symptoms: List[str] = Field(default_factory=list, description="Extracted list of reported patient symptoms")
    duration: str = Field(default="", description="Reported duration of symptoms")
    urgency: UrgencyLevelEnum = Field(default=UrgencyLevelEnum.LOW, description="Triage urgency level")
    recommendation: str = Field(default="", description="Evidence-backed next step care recommendation")
    confidence: float = Field(default=0.0, description="Confidence score percentage (0-100)")
    emergency: bool = Field(default=False, description="Red flag emergency status indicator")

class ChatMessageSchema(BaseModel):
    id: str
    sender: str  # 'user' | 'gemma'
    text: str
    timestamp: str
    languageCode: Optional[str] = "en"
    isVoiceInput: Optional[bool] = False

class ChatRequestSchema(BaseModel):
    sessionId: str = Field(..., description="Unique triage session identifier")
    text: str = Field(..., description="User symptom input text")
    languageCode: Optional[str] = Field("en", description="Target ISO 639-1 language code")
    history: Optional[List[ChatMessageSchema]] = Field(default_factory=list)
    summary: Optional[HealthSummarySchema] = None

class ChatResponseSchema(BaseModel):
    assistantMessage: str = Field(..., description="Gemma AI response to patient in target language")
    healthSummary: HealthSummarySchema = Field(..., description="Extracted health summary data")
    followUpQuestions: List[str] = Field(default_factory=list, description="Suggested follow-up questions")
    thoughtProcess: Optional[List[str]] = Field(default_factory=list, description="Gemma reasoning trace steps")

class StartSessionRequest(BaseModel):
    languageCode: Optional[str] = "en"

class ReportRequest(BaseModel):
    sessionId: str
    history: List[ChatMessageSchema]
    summary: HealthSummarySchema
    patientAge: Optional[str] = "Unspecified"
    patientGender: Optional[str] = "Unspecified"

class ReportResponse(BaseModel):
    sessionId: str
    reportId: str
    generatedAt: str
    summary: HealthSummarySchema
    physicianBrief: str
    disclaimer: str

class HospitalItem(BaseModel):
    name: str
    address: str
    distanceKm: float
    phone: str
    emergencyRoom: bool

class HospitalSearchResponse(BaseModel):
    query: str
    hospitals: List[HospitalItem]
