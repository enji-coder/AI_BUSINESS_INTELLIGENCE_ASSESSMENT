import os
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BusinessReport
from ..schemas import ReportOut
from ..services.pdf_service import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.get("", response_model=List[ReportOut])
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(BusinessReport).order_by(BusinessReport.created_at.desc()).all()
    results = []
    for r in reports:
        results.append({
            "id": r.id,
            "run_id": r.run_id,
            "title": r.title,
            "industry": r.industry,
            "date_coverage": r.date_coverage,
            "executive_summary": r.executive_summary,
            "verification_status": r.verification_status,
            "verification_score": r.verification_score,
            "verification_details": r.verification_details,
            "created_at": r.created_at,
            "full_report": json.loads(r.full_report_json) if r.full_report_json else {}
        })
    return results

@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    r = db.query(BusinessReport).filter(BusinessReport.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found.")
    
    return {
        "id": r.id,
        "run_id": r.run_id,
        "title": r.title,
        "industry": r.industry,
        "date_coverage": r.date_coverage,
        "executive_summary": r.executive_summary,
        "verification_status": r.verification_status,
        "verification_score": r.verification_score,
        "verification_details": r.verification_details,
        "created_at": r.created_at,
        "full_report": json.loads(r.full_report_json) if r.full_report_json else {}
    }

@router.get("/{report_id}/pdf")
def download_pdf(report_id: int, db: Session = Depends(get_db)):
    r = db.query(BusinessReport).filter(BusinessReport.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found.")
    
    pdf_dir = os.path.join(os.getcwd(), "generated_reports")
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_filename = f"EduIntel_BI_Report_{r.run_id}.pdf"
    pdf_path = os.path.join(pdf_dir, pdf_filename)

    # Always generate / refresh if not exists
    report_payload = json.loads(r.full_report_json) if r.full_report_json else {}
    report_payload["run_id"] = r.run_id
    report_payload["executive_summary"] = r.executive_summary
    report_payload["verification_score"] = r.verification_score

    generate_pdf_report(report_payload, pdf_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )
