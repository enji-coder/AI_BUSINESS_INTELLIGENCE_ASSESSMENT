from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import ChatMessage, User
from ..schemas import ChatPrompt, ChatResponse
from ..services.analytics_service import calculate_education_kpis
from ..agents.llm_client import generate_agent_response

router = APIRouter(prefix="/chat", tags=["Multi-Agent Business Chat"])

@router.post("", response_model=ChatResponse)
def ask_chat(
    prompt_in: ChatPrompt,
    db: Session = Depends(get_db)
):
    user_query = prompt_in.message.strip().lower()
    kpis = calculate_education_kpis(db)
    
    # Identify which agent should answer primarily based on query keywords
    if any(w in user_query for w in ["fee", "revenue", "money", "paid", "pending", "dues", "cost", "collection", "rupee", "₹"]):
        agent_key = "finance"
        agent_name = "Finance Agent"
        role = "Institutional Financial Controller"
        agent_sources = "Finance Agent & Data Analyst Agent"
    elif any(w in user_query for w in ["dropout", "drop", "attendance", "absent", "batch", "topic", "submission", "late", "score", "grade", "faculty"]):
        agent_key = "operations"
        agent_name = "Operations Agent"
        role = "Academic Operations & Delivery Director"
        agent_sources = "Operations Agent & Data Analyst Agent"
    elif any(w in user_query for w in ["city", "marketing", "acquisition", "online", "offline", "hybrid", "demographic", "enrollment", "professionals"]):
        agent_key = "marketing"
        agent_name = "Marketing Agent"
        role = "Student Acquisition Strategist"
        agent_sources = "Marketing Agent"
    elif any(w in user_query for w in ["strategy", "recommend", "action", "plan", "growth", "roadmap", "improve", "decision"]):
        agent_key = "strategy"
        agent_name = "Strategy Agent"
        role = "Chief Executive Institutional Strategist"
        agent_sources = "Strategy Agent & Verification Agent"
    elif any(w in user_query for w in ["verify", "verification", "check", "truth", "audit", "accuracy", "discrepancy"]):
        agent_key = "verification"
        agent_name = "Verification Agent"
        role = "Chief Academic Auditor"
        agent_sources = "Verification Agent"
    else:
        agent_key = "data_analyst"
        agent_name = "Data Analyst Agent"
        role = "Senior Academic Data Analyst"
        agent_sources = "Data Analyst Agent & Collective Swarm"

    # Generate answer
    reply = generate_agent_response(
        agent_name=agent_name,
        role=role,
        prompt=prompt_in.message,
        context_data=kpis
    )

    # Save to history
    chat_entry = ChatMessage(
        role="user",
        message=prompt_in.message,
        agent_sources=agent_sources,
        created_at=datetime.utcnow()
    )
    db.add(chat_entry)
    
    asst_entry = ChatMessage(
        role="assistant",
        message=reply,
        agent_sources=agent_sources,
        created_at=datetime.utcnow()
    )
    db.add(asst_entry)
    db.commit()

    suggested = [
        "What is our overall student dropout rate?",
        "How much uncollected tuition fee is currently outstanding?",
        "Which course has the highest student enrollment?",
        "What are the urgent HITL recommendations awaiting approval?"
    ]

    return {
        "reply": reply,
        "agent_sources": agent_sources,
        "suggested_actions": suggested
    }

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).order_by(ChatMessage.created_at.asc()).limit(50).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "message": m.message,
            "agent_sources": m.agent_sources,
            "created_at": m.created_at
        }
        for m in messages
    ]
