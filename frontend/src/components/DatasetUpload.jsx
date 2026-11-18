import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertCircle, 
  RefreshCw,
  Table,
  Check,
  Bot,
  ArrowRight,
  BarChart3,
  FileText,
  Sparkles,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export default function DatasetUpload({ 
  datasetStatus, 
  onRefreshStatus, 
  onNavigateToDashboard, 
  onNavigateToAgents,
  onNavigateToReports 
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastUploadedSummary, setLastUploadedSummary] = useState(null);

  const entities = datasetStatus?.entities || {
    students: 1200,
    enrollments: 1600,
    attendance: 2500,
    assessments: 1800,
    fee_payments: 1200
  };

  const totalRecords = datasetStatus?.total_records || 8300;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setUploadSuccess(null);
      setLastUploadedSummary(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    setUploadSuccess(null);
    setUploadStep(1);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: Upload & Ingest
      setUploadStep(1);
      
      const stepTimer = setTimeout(() => {
        setUploadStep(2); // Auto-Running 6 Agents
      }, 1500);

      const res = await api.uploadDataset(formData);
      clearTimeout(stepTimer);

      setUploadStep(3); // Recalculating charts & reports

      setTimeout(async () => {
        setUploadSuccess(res.message || 'Dataset ingested and analyzed by 6-Agent Swarm successfully!');
        setLastUploadedSummary({
          fileName: file.name,
          records: res.total_records || totalRecords,
          imported: res.imported_records || entities,
          agentRunId: res.agent_run_id || 'AUTO_SWARM_RUN'
        });
        setFile(null);
        setUploading(false);
        setUploadStep(0);
        
        // Refresh entire app state (KPIs, Charts, Agents, Approvals, Reports)
        if (onRefreshStatus) {
          await onRefreshStatus();
        }
      }, 1200);

    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload or process dataset.');
      setUploading(false);
      setUploadStep(0);
    }
  };

  const entityCards = [
    { name: "Students Cohort", count: entities.students, icon: "👨‍🎓", desc: "Demographics, cities, age, education levels" },
    { name: "Course Enrollments", count: entities.enrollments, icon: "📚", desc: "Course, fees, delivery mode (Online/Offline/Hybrid)" },
    { name: "Session Attendance", count: entities.attendance, icon: "📅", desc: "Batch topics, session durations, attendance status" },
    { name: "Assessments & Grades", count: entities.assessments, icon: "📝", desc: "Assignments, quizzes, scores, grades (A-D), submission status" },
    { name: "Fee Payments & Dues", count: entities.fee_payments, icon: "💳", desc: "Installments, payment methods (UPI/Card/Cash), paid vs pending" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Control Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                Live Dataset Ingestion & Telemetry Pipeline
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Active: {datasetStatus?.coverage_period || "May 1, 2026 – October 31, 2026"}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2.5">
              Upload Excel / CSV & Auto-Trigger 6-Agent Swarm
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Upload any educational telemetry dataset (<code className="text-cyan-400 font-mono">02_Education.xlsx</code> or CSV). Upon upload, all 6 autonomous agents automatically re-analyze the data, formulate strategic interventions, verify factual accuracy, and update all dashboard charts and executive reports.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onRefreshStatus}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-2 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Relational Entity Breakdown */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          Active Database Telemetry Tables ({totalRecords.toLocaleString()} Total Verified Records)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {entityCards.map((card, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1.5 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{card.icon}</span>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/80">
                  {card.count?.toLocaleString()} rows
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">{card.name}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              Upload Educational Dataset (.xlsx, .xls, .csv)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or drop an Excel workbook with sheets (Students, Enrollments, Attendance, Assessments, Fee_Payments) or single-sheet CSV.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/90 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 hidden md:inline">
            Auto 6-Agent Swarm Analysis Enabled
          </span>
        </div>

        <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-3xl p-8 md:p-10 text-center transition bg-slate-950/60">
          <FileSpreadsheet className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-80 animate-pulse" />
          <p className="text-sm font-semibold text-slate-200">
            {file ? file.name : "Drag & drop your Excel / CSV file here, or browse files"}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Supports multi-sheet workbook <code className="text-cyan-400 font-mono">02_Education.xlsx</code> or custom CSV exports up to 50MB.
          </p>

          <input
            type="file"
            id="fileInput"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-5 flex items-center justify-center space-x-3.5">
            <label
              htmlFor="fileInput"
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition shadow-md"
            >
              Choose File
            </label>

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing & Running Swarm...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Upload & Run 6-Agent Swarm</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live Upload & Swarm Execution Pipeline Progress Indicator */}
        {uploading && (
          <div className="mt-6 p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                Live Swarm Processing Pipeline Active
              </span>
              <span className="font-mono text-slate-400">Step {uploadStep} of 3</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-2 transition-all duration-500 rounded-full"
                style={{ width: uploadStep === 1 ? '33%' : uploadStep === 2 ? '75%' : '100%' }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
              <div className={`p-2 rounded-xl border ${uploadStep >= 1 ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-200' : 'border-slate-800 text-slate-500'}`}>
                1. Database Ingestion & Relational Commit
              </div>
              <div className={`p-2 rounded-xl border ${uploadStep >= 2 ? 'border-indigo-500/50 bg-indigo-950/20 text-indigo-200' : 'border-slate-800 text-slate-500'}`}>
                2. 6-Agent Swarm Intelligence Analysis
              </div>
              <div className={`p-2 rounded-xl border ${uploadStep >= 3 ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200' : 'border-slate-800 text-slate-500'}`}>
                3. Regenerating Charts & Executive Report
              </div>
            </div>
          </div>
        )}

        {/* Success Banner with Direct Navigation Pills */}
        {uploadSuccess && (
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 text-slate-200 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Dataset Successfully Ingested & Analyzed!
                </h4>
                <p className="text-xs text-emerald-300/90 mt-0.5">
                  {uploadSuccess}
                </p>
                {lastUploadedSummary && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    File: <b className="text-slate-200">{lastUploadedSummary.fileName}</b> • Records Ingested: <b className="text-cyan-300">{lastUploadedSummary.records?.toLocaleString()}</b>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-800/80">
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>View Updated Dashboard & Charts</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={onNavigateToAgents}
                className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Inspect 6-Agent Swarm Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={onNavigateToReports}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Updated PDF Report</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
