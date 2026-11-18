import os
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from ..models import Student, Enrollment, Attendance, Assessment, FeePayment

def calculate_education_kpis(db: Session, excel_path: str = "02_Education.xlsx") -> dict:
    """
    Computes rigorous ground-truth business & academic KPIs from DB (or Excel directly if DB is bootstrapping).
    """
    # Check if DB has students
    student_count = db.query(Student).count() if db is not None else 0
    if student_count > 0:
        # Load from DB via Pandas
        students_df = pd.read_sql(db.query(Student).statement, db.bind)
        enrollments_df = pd.read_sql(db.query(Enrollment).statement, db.bind)
        attendance_df = pd.read_sql(db.query(Attendance).statement, db.bind)
        assessments_df = pd.read_sql(db.query(Assessment).statement, db.bind)
        fees_df = pd.read_sql(db.query(FeePayment).statement, db.bind)
    else:
        # Load directly from Excel file
        if not os.path.exists(excel_path):
            # Try finding it in workspace root
            excel_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "02_Education.xlsx")
        
        students_df = pd.read_excel(excel_path, sheet_name="Students")
        enrollments_df = pd.read_excel(excel_path, sheet_name="Enrollments")
        attendance_df = pd.read_excel(excel_path, sheet_name="Attendance")
        assessments_df = pd.read_excel(excel_path, sheet_name="Assessments")
        fees_df = pd.read_excel(excel_path, sheet_name="Fee_Payments")

    # --- 1. Core Summary Metrics ---
    total_students = int(len(students_df))
    total_enrollments = int(len(enrollments_df))
    
    # Status breakdown
    status_counts = enrollments_df["enrollment_status"].value_counts().to_dict()
    active_enrollments = int(status_counts.get("Active", 0))
    completed_enrollments = int(status_counts.get("Completed", 0))
    dropped_enrollments = int(status_counts.get("Dropped", 0))
    on_hold_enrollments = int(status_counts.get("On Hold", 0))

    dropout_rate = round((dropped_enrollments / total_enrollments) * 100, 2) if total_enrollments else 0.0
    completion_rate = round((completed_enrollments / total_enrollments) * 100, 2) if total_enrollments else 0.0
    retention_rate = round(100.0 - dropout_rate, 2)

    # --- 2. Financial Metrics ---
    total_billed_revenue = round(float(enrollments_df["course_fee"].sum()), 2)
    paid_fees = fees_df[fees_df["payment_status"] == "Paid"]
    pending_fees = fees_df[fees_df["payment_status"] == "Pending"]
    failed_fees = fees_df[fees_df["payment_status"] == "Failed"]

    total_collected_fee = round(float(paid_fees["amount"].sum()), 2)
    total_pending_fee = round(float(pending_fees["amount"].sum()), 2)
    total_failed_fee = round(float(failed_fees["amount"].sum()), 2)
    total_uncollected_fee = round(total_pending_fee + total_failed_fee, 2)
    fee_collection_efficiency = round((total_collected_fee / (total_collected_fee + total_uncollected_fee)) * 100, 2) if (total_collected_fee + total_uncollected_fee) > 0 else 0.0

    # Payment methods breakdown
    payment_methods = fees_df["payment_method"].value_counts().to_dict()

    # --- 3. Academic & Operational Metrics ---
    total_attendance_records = len(attendance_df)
    att_counts = attendance_df["attendance_status"].value_counts().to_dict()
    present_count = int(att_counts.get("Present", 0))
    absent_count = int(att_counts.get("Absent", 0))
    late_count = int(att_counts.get("Late", 0))

    overall_attendance_rate = round((present_count / total_attendance_records) * 100, 2) if total_attendance_records else 0.0
    absenteeism_rate = round((absent_count / total_attendance_records) * 100, 2) if total_attendance_records else 0.0

    # Assessment grades
    grade_counts = assessments_df["grade"].value_counts().to_dict()
    total_assessments = len(assessments_df)
    submission_counts = assessments_df["submission_status"].value_counts().to_dict()
    
    avg_assessment_score = round(float(assessments_df["score"].mean()), 2)
    d_grade_count = int(grade_counts.get("D", 0))
    at_risk_grade_pct = round((d_grade_count / total_assessments) * 100, 2) if total_assessments else 0.0

    # --- 4. Course-wise Performance ---
    course_perf = []
    for course_name, group in enrollments_df.groupby("course"):
        c_enrolls = len(group)
        c_dropped = len(group[group["enrollment_status"] == "Dropped"])
        c_completed = len(group[group["enrollment_status"] == "Completed"])
        c_revenue = float(group["course_fee"].sum())
        
        # Course assessment score
        c_asm = assessments_df[assessments_df["course"] == course_name]
        c_avg_score = round(float(c_asm["score"].mean()), 2) if len(c_asm) else 0.0
        
        course_perf.append({
            "course": course_name,
            "enrollments": c_enrolls,
            "completed": c_completed,
            "dropped": c_dropped,
            "dropout_rate": round((c_dropped / c_enrolls) * 100, 2) if c_enrolls else 0.0,
            "total_revenue": round(c_revenue, 2),
            "avg_score": c_avg_score
        })
    course_perf = sorted(course_perf, key=lambda x: x["enrollments"], reverse=True)

    # --- 5. Monthly Trends (May 2026 - Oct 2026) ---
    enrollments_df["month"] = pd.to_datetime(enrollments_df["enrollment_date"]).dt.strftime("%Y-%m")
    monthly_enrollment = enrollments_df.groupby("month").size().to_dict()
    
    fees_df["month"] = pd.to_datetime(fees_df["payment_date"]).dt.strftime("%Y-%m")
    monthly_paid = fees_df[fees_df["payment_status"] == "Paid"].groupby("month")["amount"].sum().to_dict()
    monthly_pending = fees_df[fees_df["payment_status"] != "Paid"].groupby("month")["amount"].sum().to_dict()

    months_list = sorted(list(set(list(monthly_enrollment.keys()) + list(monthly_paid.keys()))))
    monthly_trends = []
    for m in months_list:
        monthly_trends.append({
            "month": m,
            "enrollments": int(monthly_enrollment.get(m, 0)),
            "fee_collected": round(float(monthly_paid.get(m, 0.0)), 2),
            "fee_pending": round(float(monthly_pending.get(m, 0.0)), 2)
        })

    # --- 6. Demographics & Delivery Mode ---
    delivery_modes = enrollments_df["delivery_mode"].value_counts().to_dict()
    cities = students_df["city"].value_counts().head(10).to_dict()
    education_levels = students_df["education_level"].value_counts().to_dict()

    return {
        "summary": {
            "total_students": total_students,
            "total_enrollments": total_enrollments,
            "active_enrollments": active_enrollments,
            "completed_enrollments": completed_enrollments,
            "dropped_enrollments": dropped_enrollments,
            "on_hold_enrollments": on_hold_enrollments,
            "dropout_rate": dropout_rate,
            "completion_rate": completion_rate,
            "retention_rate": retention_rate,
        },
        "financials": {
            "total_billed_revenue": total_billed_revenue,
            "total_collected_fee": total_collected_fee,
            "total_pending_fee": total_pending_fee,
            "total_failed_fee": total_failed_fee,
            "total_uncollected_fee": total_uncollected_fee,
            "fee_collection_efficiency": fee_collection_efficiency,
            "payment_methods": payment_methods
        },
        "academics": {
            "overall_attendance_rate": overall_attendance_rate,
            "absenteeism_rate": absenteeism_rate,
            "attendance_breakdown": {
                "Present": present_count,
                "Absent": absent_count,
                "Late": late_count
            },
            "avg_assessment_score": avg_assessment_score,
            "grades_breakdown": grade_counts,
            "submissions_breakdown": submission_counts,
            "at_risk_grade_pct": at_risk_grade_pct
        },
        "course_performance": course_perf,
        "monthly_trends": monthly_trends,
        "delivery_modes": delivery_modes,
        "demographics": {
            "top_cities": cities,
            "education_levels": education_levels
        }
    }
