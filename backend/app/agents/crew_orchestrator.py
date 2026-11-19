import uuid
import datetime
import time
from typing import Dict, Any
from sqlalchemy.orm import Session

from ..models import AgentExecution
from ..services.analytics_service import calculate_education_kpis
from .crewai_engine import create_education_crew

def run_education_intelligence_crew(
    db: Session,
    workflow_type: str = "Sequential-Hierarchical",
    initiated_by: str = "Director"
) -> Dict[str, Any]:
    """
    Executes the 6-agent collaborative intelligence pipeline using CrewAI architecture:
    1. Data Analyst Agent -> Statistical KPIs & anomaly detection
    2. Marketing Agent -> Demographics, delivery modes & acquisition
    3. Finance Agent -> Tuition cashflow, default risks & debt recovery
    4. Operations Agent -> Attendance bottlenecks, submission delays & faculty utilization
    5. Strategy Agent -> Consolidated strategic roadmap & dynamic HITL recommendations
    6. Verification Agent -> Dynamic numerical verification matrix & mathematical audit score
    """
    run_id = f"RUN_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6].upper()}"
    start_time = time.time()

    # 1. Initialize execution record
    execution = AgentExecution(
        run_id=run_id,
        workflow_type=workflow_type,
        status="Running",
        started_at=datetime.datetime.utcnow(),
        initiated_by=initiated_by
    )
    db.add(execution)
    db.commit()

    # 2. Compute Ground-Truth Metrics from Database
    ground_truth_kpis = calculate_education_kpis(db)

    # 3. DIRECTLY INSTANTIATE AND RUN CREWAI MULTI-AGENT CREW
    print(f"\n[CrewAI Multi-Agent Pipeline] Initializing 6-Agent Swarm for Execution ID: {run_id}")
    crew = create_education_crew(workflow_type=workflow_type)
    
    # Kickoff execution with ground-truth inputs, passing DB session to log each step & save deliverables
    kickoff_results = crew.kickoff(inputs=ground_truth_kpis, db=db, run_id=run_id)

    # 4. Finalize execution status
    total_duration = round(time.time() - start_time, 2)
    execution.status = "Completed"
    execution.completed_at = datetime.datetime.utcnow()
    execution.total_duration_seconds = total_duration
    db.commit()

    print(f"[CrewAI Multi-Agent Pipeline] Run {run_id} finished in {total_duration}s with Verification Score: {kickoff_results.get('verification_score')}%")

    return {
        "run_id": run_id,
        "status": "Completed",
        "duration_seconds": total_duration,
        "executive_summary": kickoff_results.get("executive_summary"),
        "verification_score": kickoff_results.get("verification_score"),
        "report_id": kickoff_results.get("report_id"),
        "hitl_count": kickoff_results.get("hitl_count", 0),
        "findings": kickoff_results.get("results")
    }
