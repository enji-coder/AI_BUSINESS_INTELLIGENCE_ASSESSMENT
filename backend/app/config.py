import os

class Settings:
    PROJECT_NAME: str = "EduIntel AI - Smart Education Business Operations & Decision Intelligence System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: PostgreSQL with seamless fallback to SQLite
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./education_bi.db")
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-education-bi-jwt-key-2026-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
