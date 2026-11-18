import os
import pandas as pd
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from .models import (
    User, BusinessProfile, Student, Enrollment, 
    Attendance, Assessment, FeePayment, HITLRecommendation
)
from .auth import get_password_hash

def seed_database(excel_path: str = "02_Education.xlsx"):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Create Default Admin / Director User
        admin = db.query(User).filter(User.email == "director@apexinstitute.edu").first()
        if not admin:
            admin = User(
                email="director@apexinstitute.edu",
                hashed_password=get_password_hash("Director@2026"),
                full_name="Dr. Rajesh Mehta",
                role="Director"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            # Profile
            profile = BusinessProfile(
                user_id=admin.id,
                institute_name="Apex Institute of Advanced Technology",
                industry="Education: Institute & Student Performance Intelligence",
                team_size="65 Faculty & Operations Staff",
                student_capacity=2500,
                business_goals="Drive 90%+ course completion rate, reduce dropouts in tech batches below 10%, recover ₹7.5M in pending fees, and optimize hybrid learning delivery."
            )
            db.add(profile)
            db.commit()
            print("Created default Director user: director@apexinstitute.edu / Director@2026")

        # 2. Check if students are already seeded
        existing_students = db.query(Student).count()
        if existing_students > 0:
            print(f"Database already seeded with {existing_students} students.")
            return

        # Locate Excel file
        if not os.path.exists(excel_path):
            alt_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "02_Education.xlsx")
            if os.path.exists(alt_path):
                excel_path = alt_path
            else:
                alt_path2 = os.path.join(os.getcwd(), "02_Education.xlsx")
                if os.path.exists(alt_path2):
                    excel_path = alt_path2

        print(f"Seeding dataset from {excel_path}...")
        
        # Read Excel sheets
        students_df = pd.read_excel(excel_path, sheet_name="Students")
        enrollments_df = pd.read_excel(excel_path, sheet_name="Enrollments")
        attendance_df = pd.read_excel(excel_path, sheet_name="Attendance")
        assessments_df = pd.read_excel(excel_path, sheet_name="Assessments")
        fees_df = pd.read_excel(excel_path, sheet_name="Fee_Payments")

        # Ingest Students
        students_list = []
        for _, row in students_df.iterrows():
            students_list.append(Student(
                student_id=str(row["student_id"]),
                student_name=str(row["student_name"]),
                age=int(row["age"]),
                gender=str(row["gender"]),
                city=str(row["city"]),
                email=str(row["email"]),
                admission_date=str(row["admission_date"]),
                education_level=str(row["education_level"])
            ))
        db.bulk_save_objects(students_list)
        db.commit()
        print(f"Ingested {len(students_list)} students.")

        # Ingest Enrollments
        enrollments_list = []
        for _, row in enrollments_df.iterrows():
            enrollments_list.append(Enrollment(
                enrollment_id=str(row["enrollment_id"]),
                student_id=str(row["student_id"]),
                course=str(row["course"]),
                enrollment_date=str(row["enrollment_date"]),
                batch_id=str(row["batch_id"]),
                course_fee=float(row["course_fee"]),
                enrollment_status=str(row["enrollment_status"]),
                delivery_mode=str(row["delivery_mode"])
            ))
        db.bulk_save_objects(enrollments_list)
        db.commit()
        print(f"Ingested {len(enrollments_list)} enrollments.")

        # Ingest Attendance
        attendance_list = []
        for _, row in attendance_df.iterrows():
            attendance_list.append(Attendance(
                attendance_id=str(row["attendance_id"]),
                student_id=str(row["student_id"]),
                batch_id=str(row["batch_id"]),
                attendance_date=str(row["attendance_date"]),
                session_topic=str(row["session_topic"]),
                attendance_status=str(row["attendance_status"]),
                session_duration_minutes=int(row["session_duration_minutes"])
            ))
        db.bulk_save_objects(attendance_list)
        db.commit()
        print(f"Ingested {len(attendance_list)} attendance records.")

        # Ingest Assessments
        assessments_list = []
        for _, row in assessments_df.iterrows():
            assessments_list.append(Assessment(
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
        db.bulk_save_objects(assessments_list)
        db.commit()
        print(f"Ingested {len(assessments_list)} assessments.")

        # Ingest Fee Payments
        fees_list = []
        for _, row in fees_df.iterrows():
            fees_list.append(FeePayment(
                payment_id=str(row["payment_id"]),
                student_id=str(row["student_id"]),
                payment_date=str(row["payment_date"]),
                amount=float(row["amount"]),
                payment_method=str(row["payment_method"]),
                payment_status=str(row["payment_status"]),
                installment_no=int(row["installment_no"]),
                receipt_no=str(row["receipt_no"])
            ))
        db.bulk_save_objects(fees_list)
        db.commit()
        print(f"Ingested {len(fees_list)} fee payment records.")

        # Seed Initial Human-In-The-Loop Pending Recommendations
        init_recommendations = [
            HITLRecommendation(
                run_id="INIT_AUDIT_2026",
                agent_name="Strategy Agent",
                title="Recover ₹3.76M Outstanding Fees via 10% Early Settlement Scheme",
                category="Financial",
                proposed_action="Offer an immediate 10% discount on overdue 2nd & 3rd installments if cleared within 14 days, automated via WhatsApp & Email reminders.",
                business_impact="Projected recovery of ₹2.8M (74% of pending ₹3.76M dues) within 30 days, improving operating cash flow significantly.",
                estimated_budget_impact="Net positive cash flow +₹2.5M after discount adjustments",
                priority="Urgent",
                verification_status="Verified by Verification Agent (Numerical basis: 306 pending payments totaling ₹3,767,133.00)",
                status="PENDING"
            ),
            HITLRecommendation(
                run_id="INIT_AUDIT_2026",
                agent_name="Operations Agent",
                title="Remedial Academic Bootcamps for High-Risk D-Grade Cohort (596 Students)",
                category="Academic",
                proposed_action="Mandate 2-hour weekend mentor-led problem solving workshops for students scoring D in Full Stack Development & Python courses.",
                business_impact="Expected to reduce course dropout rate from 23.9% down to <14% by improving academic confidence before final projects.",
                estimated_budget_impact="₹85,000 faculty stipend & lab compute costs",
                priority="High",
                verification_status="Verified by Verification Agent (Numerical basis: 596 D-grades, 458 missing and 458 late submissions)",
                status="PENDING"
            ),
            HITLRecommendation(
                run_id="INIT_AUDIT_2026",
                agent_name="Marketing Agent",
                title="Expand Hybrid Delivery Marketing Campaign across Ahmedabad, Surat & Pune",
                category="Marketing",
                proposed_action="Allocate ₹150,000 targeted digital ad spend for Hybrid 'AI Engineering' and 'Data Analytics' courses targeting working professionals in top 3 cities.",
                business_impact="Estimated 35% increase in Q4 admissions (projected ₹3.2M additional tuition fees).",
                estimated_budget_impact="₹150,000 ad budget allocation",
                priority="Medium",
                verification_status="Verified by Verification Agent (Numerical basis: Pune, Surat, Ahmedabad represent 42% of total student base)",
                status="APPROVED",
                reviewer_comment="Approved for next quarterly campaign start.",
                reviewed_at=pd.Timestamp.utcnow()
            )
        ]
        for rec in init_recommendations:
            db.add(rec)
        db.commit()
        print("Seeded initial HITL approval records.")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
