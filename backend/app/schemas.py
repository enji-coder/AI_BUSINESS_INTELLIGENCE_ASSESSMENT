from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Director"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Business Profile Schemas ---
class ProfileUpdate(BaseModel):
    institute_name: str
    industry: str
    team_size: str
    student_capacity: int
    business_goals: str

class ProfileOut(BaseModel):
    id: int
    institute_name: str
    industry: str
    team_size: str
    student_capacity: int
    business_goals: str
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Agent & Execution Schemas ---
class AgentRunRequest(BaseModel):
    workflow_type: Optional[str] = "Sequential-Hierarchical"
    focus_industry: Optional[str] = "Education"
    custom_instructions: Optional[str] = None

class AgentLogOut(BaseModel):
    id: int
    agent_name: str
    agent_role: str
    step_number: int
    thought: Optional[str]
    action_taken: Optional[str]
    observation: Optional[str]
    output_summary: Optional[str]
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AgentExecutionOut(BaseModel):
    run_id: str
    workflow_type: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    total_duration_seconds: Optional[float]
    logs: List[AgentLogOut] = []

    class Config:
        from_attributes = True

# --- HITL Approval Schemas ---
class HITLDecision(BaseModel):
    decision: str  # APPROVED, REJECTED, ADJUSTED
    comment: Optional[str] = None

class HITLOut(BaseModel):
    id: int
    run_id: Optional[str]
    agent_name: str
    title: str
    category: str
    proposed_action: str
    business_impact: str
    estimated_budget_impact: Optional[str]
    priority: str
    verification_status: str
    status: str
    reviewer_comment: Optional[str]
    reviewed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# --- Chat Schemas ---
class ChatPrompt(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    agent_sources: str
    suggested_actions: List[str] = []

# --- Report Schemas ---
class ReportOut(BaseModel):
    id: int
    run_id: str
    title: str
    industry: str
    date_coverage: str
    executive_summary: str
    verification_status: str
    verification_score: float
    verification_details: Optional[str]
    created_at: datetime
    full_report: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
