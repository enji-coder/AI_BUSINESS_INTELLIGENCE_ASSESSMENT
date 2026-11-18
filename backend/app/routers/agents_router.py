from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db, SessionLocal
from ..models import AgentExecution, AgentLog, User
from ..schemas import AgentRunRequest, AgentExecutionOut, AgentLogOut
from ..auth import get_current_user
from ..agents.crew_orchestrator import run_education_intelligence_crew

router = APIRouter(prefix="/agents", tags=["Multi-Agent Orchestrator"])

@router.post("/run")
def trigger_agent_run(
    request: AgentRunRequest,
    db: Session = Depends(get_db)
):
    try:
        result = run_education_intelligence_crew(
            db=db,
            workflow_type=request.workflow_type or "Sequential-Hierarchical",
            initiated_by="Director"
        )
        return {
            "message": "Multi-agent intelligence analysis completed successfully.",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

@router.get("/runs", response_model=List[AgentExecutionOut])
def list_agent_runs(db: Session = Depends(get_db)):
    runs = db.query(AgentExecution).order_by(AgentExecution.started_at.desc()).limit(20).all()
    return runs

@router.get("/runs/{run_id}", response_model=AgentExecutionOut)
def get_agent_run(run_id: str, db: Session = Depends(get_db)):
    execution = db.query(AgentExecution).filter(AgentExecution.run_id == run_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Agent run not found.")
    return execution

@router.get("/runs/{run_id}/logs", response_model=List[AgentLogOut])
def get_agent_logs(run_id: str, db: Session = Depends(get_db)):
    logs = db.query(AgentLog).filter(AgentLog.run_id == run_id).order_by(AgentLog.step_number.asc()).all()
    return logs
