# EduIntel AI • System Architecture & Technical Specifications

This document outlines the detailed system architecture, entity relationships, agent collaboration protocols, and data flow for the **EduIntel AI - Education Institute & Student Performance Decision Intelligence System**.

---

## 1. System Architecture Overview

```mermaid
flowchart TD
    subgraph Frontend ["Frontend Layer (React.js + Tailwind CSS)"]
        UI_Dash["Executive Dashboard"]
        UI_Agent["6-Agent Swarm Monitor"]
        UI_HITL["Human-in-the-Loop Approval Center"]
        UI_Chat["Multi-Agent Contextual Chat"]
        UI_Reports["Audited Reports & PDF Downloader"]
        UI_Dataset["Dataset Telemetry Ingestion"]
    end

    subgraph Backend ["Backend Layer (FastAPI REST APIs)"]
        API_Auth["/api/auth (JWT + Bcrypt)"]
        API_Dataset["/api/dataset (Excel/CSV Processor)"]
        API_Analytics["/api/analytics (Pandas KPIs)"]
        API_Agents["/api/agents (Crew Orchestrator)"]
        API_Approvals["/api/approvals (HITL Decisions)"]
        API_Chat["/api/chat (Routing & QA)"]
        API_Reports["/api/reports (ReportLab PDF)"]
    end

    subgraph MultiAgent ["Multi-Agent Intelligence Layer (CrewAI Compliant)"]
        A1["Agent 1: Data Analyst Agent"]
        A2["Agent 2: Marketing Agent"]
        A3["Agent 3: Finance Agent"]
        A4["Agent 4: Operations Agent"]
        A5["Agent 5: Strategy Agent"]
        A6["Agent 6: Verification Agent"]
    end

    subgraph DataLayer ["Data & Storage Layer (PostgreSQL / SQLite)"]
        DB_Students["Students (1,200)"]
        DB_Enrollments["Enrollments (1,600)"]
        DB_Attendance["Attendance (2,500)"]
        DB_Assessments["Assessments (1,800)"]
        DB_Fees["Fee Payments (1,200)"]
        DB_Logs["Agent Execution Logs"]
        DB_Reports["Business Reports"]
        DB_HITL["HITL Recommendations"]
        DB_Users["Users & Profiles"]
    end

    Frontend <-->|REST JSON & JWT| Backend
    Backend <-->|SQLAlchemy ORM| DataLayer
    API_Agents --> MultiAgent
    A1 --> A2 & A3 & A4
    A2 & A3 & A4 --> A5
    A5 --> A6
    A6 -->|Audit Verification| API_Reports
    A5 -->|HITL Proposals| DB_HITL
```

---

## 2. Multi-Agent Sequential-Hierarchical Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Director as Director (User)
    participant Orchestrator as Crew Orchestrator
    participant Analytics as Pandas Analytics Engine
    participant A1 as Data Analyst Agent
    participant A2 as Marketing Agent
    participant A3 as Finance Agent
    participant A4 as Operations Agent
    participant A5 as Strategy Agent
    participant A6 as Verification Agent
    participant DB as SQL Database

    Director->>Orchestrator: Trigger 6-Agent Swarm Run
    Orchestrator->>Analytics: Compute Ground-Truth Telemetry (8,300 rows)
    Analytics-->>Orchestrator: Verified Metrics (Dropouts, Revenue, Attendance)

    Note over Orchestrator,A1: Step 1: Empirical Analysis
    Orchestrator->>A1: Extract statistical cohorts & anomalies
    A1-->>Orchestrator: 23.94% dropouts, 33.1% D-grades, ₹58.4M billed
    Orchestrator->>DB: Record Step 1 Thought & Output Log

    Note over Orchestrator,A4: Steps 2-4: Specialized Domain Analyses
    par Marketing Analysis
        Orchestrator->>A2: Analyze demographics & delivery modes
        A2-->>Orchestrator: Regional clusters (Pune, Surat, Ahmedabad)
    and Finance Analysis
        Orchestrator->>A3: Audit tuition realization & default risks
        A3-->>Orchestrator: ₹7.52M uncollected fees (50.38% collection efficiency)
    and Operations Analysis
        Orchestrator->>A4: Audit attendance & submission bottlenecks
        A4-->>Orchestrator: 458 Late / 458 Missing submissions, BAT028 friction
    end
    Orchestrator->>DB: Record Steps 2, 3, 4 Logs

    Note over Orchestrator,A5: Step 5: Hierarchical Strategic Synthesis
    Orchestrator->>A5: Synthesize cross-agent intelligence into Turnaround Roadmap
    A5-->>Orchestrator: Formulates 6-month roadmap & consequential HITL proposals
    Orchestrator->>DB: Save Proposals to HITL Queue (PENDING)

    Note over Orchestrator,A6: Step 6: Fact-Checking & Anti-Hallucination Audit
    Orchestrator->>A6: Reconcile assertions against SQL ground truth
    A6-->>Orchestrator: Audit Verdict: APPROVED (Score: 98.8%, 0 Hallucinations)
    Orchestrator->>DB: Save Verified Business Report & Certification
    Orchestrator-->>Director: Run Complete (Report Ready + PDF Available)
```

---

## 3. Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o| BUSINESS_PROFILES : owns
    USERS ||--o{ CHAT_MESSAGES : sends
    USERS ||--o{ HITL_RECOMMENDATIONS : reviews
    
    STUDENTS ||--o{ ENROLLMENTS : registers
    STUDENTS ||--o{ ATTENDANCE : logs
    STUDENTS ||--o{ ASSESSMENTS : completes
    STUDENTS ||--o{ FEE_PAYMENTS : pays
    
    AGENT_EXECUTIONS ||--o{ AGENT_LOGS : records
    AGENT_EXECUTIONS ||--o{ BUSINESS_REPORTS : generates

    STUDENTS {
        string student_id PK
        string student_name
        int age
        string gender
        string city
        string email
        string admission_date
        string education_level
    }

    ENROLLMENTS {
        string enrollment_id PK
        string student_id FK
        string course
        string enrollment_date
        string batch_id
        float course_fee
        string enrollment_status
        string delivery_mode
    }

    ATTENDANCE {
        string attendance_id PK
        string student_id FK
        string batch_id
        string attendance_date
        string session_topic
        string attendance_status
        int session_duration_minutes
    }

    ASSESSMENTS {
        string assessment_id PK
        string student_id FK
        string course
        string assessment_date
        string assessment_type
        float score
        float max_score
        string grade
        string submission_status
    }

    FEE_PAYMENTS {
        string payment_id PK
        string student_id FK
        string payment_date
        float amount
        string payment_method
        string payment_status
        int installment_no
        string receipt_no
    }

    HITL_RECOMMENDATIONS {
        int id PK
        string run_id
        string agent_name
        string title
        string category
        string proposed_action
        string business_impact
        string estimated_budget_impact
        string priority
        string verification_status
        string status
        string reviewer_comment
        datetime reviewed_at
    }
```

---

## 4. Human-in-the-Loop (HITL) State Machine

```mermaid
stateDiagram-v2
    [*] --> Generated: Strategy Agent Drafts Proposal
    Generated --> Audited: Verification Agent Fact-Checks
    Audited --> PENDING: Added to Director Review Queue
    
    PENDING --> APPROVED: Director Authorizes Execution
    PENDING --> REJECTED: Director Declines Proposal
    PENDING --> ADJUSTED: Director Modifies Parameters
    
    APPROVED --> Executed: System Records Action & Timestamp
    REJECTED --> Archived: Decision Logged in Audit Trail
    ADJUSTED --> Executed: Modified Directive Stored
    
    Executed --> [*]
    Archived --> [*]
```
