from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.analytics_service import calculate_education_kpis

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    return calculate_education_kpis(db)
