import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, 
    Text, Boolean, Index
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="Director")  # Director, Manager, Analyst, Admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("BusinessProfile", back_populates="user", uselist=False)
    chat_messages = relationship("ChatMessage", back_populates="user")
    reviews = relationship("HITLRecommendation", back_populates="reviewer")


class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    institute_name = Column(String(255), default="Apex Institute of Advanced Technology")
    industry = Column(String(100), default="Education: Institute & Student Performance Intelligence")
    team_size = Column(String(50), default="50-100 Faculty & Staff")
    student_capacity = Column(Integer, default=2000)
    business_goals = Column(Text, default="Maximize course completion rate above 85%, reduce dropout rate below 12%, optimize fee collection recovery to 95%, and scale hybrid learning.")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")


# --- DATASET ENTITIES ---

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(50), primary_key=True, index=True)
    student_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    email = Column(String(255), nullable=False)
    admission_date = Column(String(50), nullable=False, index=True)
    education_level = Column(String(100), nullable=False, index=True)

    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    fee_payments = relationship("FeePayment", back_populates="student", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), index=True)
    course = Column(String(255), nullable=False, index=True)
    enrollment_date = Column(String(50), nullable=False, index=True)
    batch_id = Column(String(50), nullable=False, index=True)
    course_fee = Column(Float, nullable=False)
    enrollment_status = Column(String(50), nullable=False, index=True)  # Active, Completed, Dropped, On Hold
    delivery_mode = Column(String(50), nullable=False, index=True)      # Online, Offline, Hybrid

    student = relationship("Student", back_populates="enrollments")


class Attendance(Base):
    __tablename__ = "attendance"

    attendance_id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), index=True)
    batch_id = Column(String(50), nullable=False, index=True)
    attendance_date = Column(String(50), nullable=False, index=True)
    session_topic = Column(String(255), nullable=False)
    attendance_status = Column(String(50), nullable=False, index=True)  # Present, Absent, Late
    session_duration_minutes = Column(Integer, default=60)

    student = relationship("Student", back_populates="attendances")


class Assessment(Base):
    __tablename__ = "assessments"

    assessment_id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), index=True)
    course = Column(String(255), nullable=False, index=True)
    assessment_date = Column(String(50), nullable=False, index=True)
    assessment_type = Column(String(100), nullable=False)  # Assignment, Quiz, Midterm, Final Project
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    grade = Column(String(10), nullable=False, index=True)  # A, B, C, D
    submission_status = Column(String(50), nullable=False, index=True) # Submitted, Late, Missing

    student = relationship("Student", back_populates="assessments")


class FeePayment(Base):
    __tablename__ = "fee_payments"

    payment_id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), index=True)
    payment_date = Column(String(50), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)   # Card, UPI, Bank Transfer, Cash
    payment_status = Column(String(50), nullable=False, index=True) # Paid, Pending, Failed
    installment_no = Column(Integer, nullable=False)
    receipt_no = Column(String(100), nullable=False)

    student = relationship("Student", back_populates="fee_payments")


# --- MULTI-AGENT EXECUTION, LOGS & REPORTS ---

class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), unique=True, index=True, nullable=False)
    workflow_type = Column(String(50), default="Sequential-Hierarchical")
    status = Column(String(50), default="Pending") # Pending, Running, Completed, Failed
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_duration_seconds = Column(Float, nullable=True)
    initiated_by = Column(String(100), default="System")

    logs = relationship("AgentLog", back_populates="execution", cascade="all, delete-orphan")
    reports = relationship("BusinessReport", back_populates="execution", cascade="all, delete-orphan")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), ForeignKey("agent_executions.run_id"), index=True)
    agent_name = Column(String(100), nullable=False, index=True) # Data Analyst, Marketing, Finance, Operations, Strategy, Verification
    agent_role = Column(String(255), nullable=False)
    step_number = Column(Integer, default=1)
    thought = Column(Text, nullable=True)
    action_taken = Column(String(255), nullable=True)
    observation = Column(Text, nullable=True)
    output_summary = Column(Text, nullable=True)
    status = Column(String(50), default="Completed") # Thinking, Executing, Completed, Flagged
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    execution = relationship("AgentExecution", back_populates="logs")


class BusinessReport(Base):
    __tablename__ = "business_reports"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), ForeignKey("agent_executions.run_id"), index=True)
    title = Column(String(255), nullable=False)
    industry = Column(String(100), default="Education")
    date_coverage = Column(String(100), default="May 1, 2026 - October 31, 2026")
    executive_summary = Column(Text, nullable=False)
    full_report_json = Column(Text, nullable=False) # JSON string of all agent findings
    verification_status = Column(String(50), default="APPROVED") # APPROVED, REJECTED, CONDITIONAL
    verification_score = Column(Float, default=98.5) # Quality audit score
    verification_details = Column(Text, nullable=True)
    pdf_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    execution = relationship("AgentExecution", back_populates="reports")


class HITLRecommendation(Base):
    __tablename__ = "hitl_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), index=True)
    agent_name = Column(String(100), default="Strategy Agent")
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Financial, Operational, Academic, Marketing
    proposed_action = Column(Text, nullable=False)
    business_impact = Column(Text, nullable=False)
    estimated_budget_impact = Column(String(100), nullable=True)
    priority = Column(String(50), default="High") # Urgent, High, Medium, Low
    verification_status = Column(String(50), default="Verified") # Verified by Verification Agent
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED, ADJUSTED
    reviewer_comment = Column(Text, nullable=True)
    reviewed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reviewer = relationship("User", back_populates="reviews")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role = Column(String(50), nullable=False) # user, assistant, system
    message = Column(Text, nullable=False)
    agent_sources = Column(String(255), default="Multi-Agent Collective")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
