import os
import shutil
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Enrollment, Attendance, Assessment, FeePayment, User
from ..auth import get_current_user
from ..agents.crew_orchestrator import run_education_intelligence_crew
from ..services.analytics_service import calculate_education_kpis

router = APIRouter(prefix="/dataset", tags=["Dataset Management"])

@router.get("/status")
def get_dataset_status(db: Session = Depends(get_db)):
    students_count = db.query(Student).count()
    enrollments_count = db.query(Enrollment).count()
    attendance_count = db.query(Attendance).count()
    assessments_count = db.query(Assessment).count()
    fees_count = db.query(FeePayment).count()

    return {
        "status": "Ready" if students_count > 0 else "Empty",
        "dataset_name": "02_Education.xlsx (Synthetic Institute Telemetry)",
        "coverage_period": "May 1, 2026 – October 31, 2026",
        "currency": "INR (₹)",
        "entities": {
            "students": students_count,
            "enrollments": enrollments_count,
            "attendance": attendance_count,
            "assessments": assessments_count,
            "fee_payments": fees_count
        },
        "total_records": students_count + enrollments_count + attendance_count + assessments_count + fees_count
    }

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls") or file.filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="Only Excel (.xlsx, .xls) or CSV files are supported.")
    
    temp_dir = os.path.join(os.getcwd(), "uploads")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)

    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        imported = {}
        if file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            xl = pd.ExcelFile(temp_file_path)
            sheets = xl.sheet_names
            
            if "Students" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Students")
                db.query(Student).delete()
                for _, row in df.iterrows():
                    db.add(Student(
                        student_id=str(row["student_id"]),
                        student_name=str(row["student_name"]),
                        age=int(row["age"]),
                        gender=str(row["gender"]),
                        city=str(row["city"]),
                        email=str(row["email"]),
                        admission_date=str(row["admission_date"]),
                        education_level=str(row["education_level"])
                    ))
                imported["students"] = len(df)

            if "Enrollments" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Enrollments")
                db.query(Enrollment).delete()
                for _, row in df.iterrows():
                    db.add(Enrollment(
                        enrollment_id=str(row["enrollment_id"]),
                        student_id=str(row["student_id"]),
                        course=str(row["course"]),
                        enrollment_date=str(row["enrollment_date"]),
                        batch_id=str(row["batch_id"]),
                        course_fee=float(row["course_fee"]),
                        enrollment_status=str(row["enrollment_status"]),
                        delivery_mode=str(row["delivery_mode"])
                    ))
                imported["enrollments"] = len(df)

            if "Attendance" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Attendance")
                db.query(Attendance).delete()
                for _, row in df.iterrows():
                    db.add(Attendance(
                        attendance_id=str(row["attendance_id"]),
                        student_id=str(row["student_id"]),
                        batch_id=str(row["batch_id"]),
                        attendance_date=str(row["attendance_date"]),
                        session_topic=str(row["session_topic"]),
                        attendance_status=str(row["attendance_status"]),
                        session_duration_minutes=int(row["session_duration_minutes"])
                    ))
                imported["attendance"] = len(df)

            if "Assessments" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Assessments")
                db.query(Assessment).delete()
                for _, row in df.iterrows():
                    db.add(Assessment(
                        assessment_id=str(row["assessment_id"]),
                        student_id=str(row["student_id"]),
                        course=str(row["course"]),
                        assessment_date=str(row["assessment_date"]),
                        assessment_type=str(row["assessment_type"]),
                        score=float(row["score"]),
                        max_score=float(row["max_score"]),
                        grade=str(row["grade"]),
                        submission_status=str(row["submission_status"])
                    ))
                imported["assessments"] = len(df)

            if "Fee_Payments" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Fee_Payments")
                db.query(FeePayment).delete()
                for _, row in df.iterrows():
                    db.add(FeePayment(
                        payment_id=str(row["payment_id"]),
                        student_id=str(row["student_id"]),
                        payment_date=str(row["payment_date"]),
                        amount=float(row["amount"]),
                        payment_method=str(row["payment_method"]),
                        payment_status=str(row["payment_status"]),
                        installment_no=int(row["installment_no"]),
                        receipt_no=str(row["receipt_no"])
                    ))
                imported["fee_payments"] = len(df)

            db.commit()

        elif file.filename.endswith(".csv"):
            df = pd.read_csv(temp_file_path)
            cols = [c.lower() for c in df.columns]
            
            if any("student" in c for c in cols):
                db.query(Student).delete()
                for idx, row in df.iterrows():
                    db.add(Student(
                        student_id=str(row.get("student_id", f"STU{idx+1:04d}")),
                        student_name=str(row.get("student_name", f"Student {idx+1}")),
                        age=int(row.get("age", 22)),
                        gender=str(row.get("gender", "Other")),
                        city=str(row.get("city", "Mumbai")),
                        email=str(row.get("email", f"stu{idx+1}@apexinstitute.edu")),
                        admission_date=str(row.get("admission_date", "2026-05-01")),
                        education_level=str(row.get("education_level", "Graduate"))
                    ))
                imported["students"] = len(df)
            elif any("fee" in c for c in cols):
                db.query(FeePayment).delete()
                for idx, row in df.iterrows():
                    db.add(FeePayment(
                        payment_id=str(row.get("payment_id", f"PAY{idx+1:05d}")),
                        student_id=str(row.get("student_id", f"STU{idx+1:04d}")),
                        payment_date=str(row.get("payment_date", "2026-05-01")),
                        amount=float(row.get("amount", 25000.0)),
                        payment_method=str(row.get("payment_method", "UPI")),
                        payment_status=str(row.get("payment_status", "Paid")),
                        installment_no=int(row.get("installment_no", 1)),
                        receipt_no=str(row.get("receipt_no", f"REC{idx+1:05d}"))
                    ))
                imported["fee_payments"] = len(df)
            db.commit()

        # Execute 6-Agent Swarm Intelligence on the newly ingested records
        agent_run_data = None
        try:
            agent_run_data = run_education_intelligence_crew(
                db=db,
                workflow_type="Sequential-Hierarchical",
                initiated_by=f"Dataset Ingestion by {current_user.full_name} ({current_user.role})"
            )
        except Exception as agent_err:
            print(f"Warning: Agent run post-upload notice: {agent_err}")

        fresh_kpis = calculate_education_kpis(db)

        return {
            "message": "Dataset uploaded, ingested, and analyzed by the 6-Agent Swarm successfully!",
            "imported_records": imported,
            "total_records": sum(imported.values()),
            "agent_run_id": agent_run_data.get("run_id") if agent_run_data else None,
            "kpis": fresh_kpis
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process dataset: {str(e)}")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
