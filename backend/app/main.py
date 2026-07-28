from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import chat, report, hospital

app = FastAPI(
    title="Sanjeevani AI — FastAPI Backend Engine",
    description="Multilingual Health Triage API powered by Google Gemma for the Build with Gemma Hackathon.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware for Local & Production Deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Render, Vercel, Localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(chat.router)
app.include_router(report.router)
app.include_router(hospital.router)

@app.get(
    "/",
    tags=["Root"],
    summary="API Root Endpoint",
    description="Returns welcome message and links to API documentation."
)
async def root():
    return {
        "message": "Sanjeevani AI FastAPI Engine is live!",
        "status": "healthy",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

@app.get(
    "/health",
    tags=["System Health"],
    summary="Backend Health Check",
    description="Returns backend server health status and active Gemma model designation."
)
async def health_check():
    return {
        "status": "healthy",
        "service": "Sanjeevani AI FastAPI Backend",
        "gemmaModel": settings.GEMMA_MODEL_NAME,
        "version": "1.0.0"
    }

@app.get(
    "/api/languages",
    tags=["Localization"],
    summary="Get supported multilingual languages",
    description="Returns list of supported ISO 639-1 language codes, native names, and flag icons."
)
async def get_supported_languages():
    return [
        {"code": "en", "name": "English", "nativeName": "English", "flag": "🇬🇧"},
        {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "flag": "🇮🇳"},
        {"code": "es", "name": "Spanish", "nativeName": "Español", "flag": "🇪🇸"},
        {"code": "bn", "name": "Bengali", "nativeName": "বাংলা", "flag": "🇮🇳"},
        {"code": "ta", "name": "Tamil", "nativeName": "தமிழ்", "flag": "🇮🇳"},
        {"code": "te", "name": "Telugu", "nativeName": "తెలుగు", "flag": "🇮🇳"},
        {"code": "mr", "name": "Marathi", "nativeName": "मराठी", "flag": "🇮🇳"},
        {"code": "gu", "name": "Gujarati", "nativeName": "ગુજરાતી", "flag": "🇮🇳"},
        {"code": "fr", "name": "French", "nativeName": "Français", "flag": "🇫🇷"},
        {"code": "de", "name": "German", "nativeName": "Deutsch", "flag": "🇩🇪"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
