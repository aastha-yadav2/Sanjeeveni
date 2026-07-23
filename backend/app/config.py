import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    GEMMA_API_KEY: str = os.getenv("GEMMA_API_KEY", "")
    GEMMA_MODEL_NAME: str = os.getenv("GEMMA_MODEL_NAME", "gemma-2-9b-it")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    @property
    def cors_origins(self) -> list:
        raw = os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://localhost:5173"]')
        try:
            return json.loads(raw)
        except Exception:
            return ["http://localhost:3000", "http://localhost:5173"]

settings = Settings()
