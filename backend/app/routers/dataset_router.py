import os
import shutil
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Enrollment, Attendance, Assessment, FeePayment, User
from ..auth import get_current_user

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
        if file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            xl = pd.ExcelFile(temp_file_path)
            sheets = xl.sheet_names
            
            # Check for education sheets
            imported = {}
            if "Students" in sheets:
                df = pd.read_excel(temp_file_path, sheet_name="Students")
                # Clear existing and update
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
            return {
                "message": "Dataset uploaded and processed successfully.",
                "imported_records": imported
            }
        else:
            return {"message": "CSV upload processed."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process dataset: {str(e)}")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
