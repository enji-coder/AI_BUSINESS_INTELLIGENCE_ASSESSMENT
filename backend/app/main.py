import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import engine, Base
from .seed import seed_database
from .routers import (
    auth_router,
    profile_router,
    dataset_router,
    analytics_router,
    agents_router,
    approvals_router,
    chat_router,
    reports_router
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Industry-Level Multi-Agent AI Business Operations & Decision Intelligence System.\n"
        "Specialized Industry: Education (Institute & Student Performance Intelligence).\n"
        "Orchestrates 6 Autonomous AI Agents (Data Analyst, Marketing, Finance, Operations, Strategy, Verification) "
        "with Ground-Truth KPI calculations, Anti-Hallucination Audits, and Human-in-the-Loop Governance."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend (Vite local & Netlify deployed domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(profile_router.router, prefix=settings.API_V1_STR)
app.include_router(dataset_router.router, prefix=settings.API_V1_STR)
app.include_router(analytics_router.router, prefix=settings.API_V1_STR)
app.include_router(agents_router.router, prefix=settings.API_V1_STR)
app.include_router(approvals_router.router, prefix=settings.API_V1_STR)
app.include_router(chat_router.router, prefix=settings.API_V1_STR)
app.include_router(reports_router.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "industry": "Education: Institute & Student Performance Intelligence",
        "docs_url": "/docs",
        "agents": [
            "Data Analyst Agent",
            "Marketing Agent",
            "Finance Agent",
            "Operations Agent",
            "Strategy Agent",
            "Verification Agent"
        ]
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
