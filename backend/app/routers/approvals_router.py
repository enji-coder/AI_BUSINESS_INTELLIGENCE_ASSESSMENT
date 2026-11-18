from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import HITLRecommendation, User
from ..schemas import HITLOut, HITLDecision
from ..auth import get_current_user

router = APIRouter(prefix="/approvals", tags=["Human-in-the-Loop Governance"])

@router.get("", response_model=List[HITLOut])
def get_recommendations(
    status_filter: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(HITLRecommendation)
    if status_filter:
        query = query.filter(HITLRecommendation.status == status_filter.upper())
    return query.order_by(HITLRecommendation.created_at.desc()).all()

@router.post("/{rec_id}/decision", response_model=HITLOut)
def record_decision(
    rec_id: int,
    decision_in: HITLDecision,
    db: Session = Depends(get_db)
):
    rec = db.query(HITLRecommendation).filter(HITLRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation proposal not found.")
    
    clean_decision = decision_in.decision.upper()
    if clean_decision not in ["APPROVED", "REJECTED", "ADJUSTED"]:
        raise HTTPException(status_code=400, detail="Decision must be APPROVED, REJECTED, or ADJUSTED.")
    
    rec.status = clean_decision
    rec.reviewer_comment = decision_in.comment or f"Decision executed by authorized Director at {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
    rec.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(rec)
    return rec
