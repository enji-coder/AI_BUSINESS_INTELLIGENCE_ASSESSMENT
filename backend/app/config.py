import os
from pathlib import Path

# Load .env if present
env_file = Path(__file__).resolve().parent.parent.parent / ".env"
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

class Settings:
    PROJECT_NAME: str = "EduIntel AI - Smart Education Business Operations & Decision Intelligence System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: PostgreSQL with seamless fallback to SQLite
    raw_db_url = os.getenv("DATABASE_URL", "sqlite:///./education_bi.db")
    
    # Format for SQLAlchemy with psycopg2 driver
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+"):
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        
    DATABASE_URL: str = raw_db_url
        
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
