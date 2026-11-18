import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertCircle, 
  RefreshCw,
  Table,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function DatasetUpload({ datasetStatus, onRefreshStatus }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadDataset(formData);
      setUploadSuccess(res.message || 'Dataset uploaded and ingested successfully!');
      setFile(null);
      if (onRefreshStatus) onRefreshStatus();
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
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
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-900/40 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold">
                Section 2 & 5 • Dataset Management
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {datasetStatus?.coverage_period || "May 1, 2026 – October 31, 2026"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Institutional Dataset Pipeline & Telemetry Ingestion
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Active dataset: <code className="text-cyan-400 font-mono font-bold">02_Education.xlsx</code> containing 5 interconnected relational sheets. All multi-agent decisions are anchored directly to these verified records.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onRefreshStatus}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Relational Entity Breakdown */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          Database Entities & Synchronized Row Counts ({totalRecords.toLocaleString()} Total Rows)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {entityCards.map((card, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{card.icon}</span>
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
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-cyan-400" />
          Upload Updated Excel / CSV Dataset (.xlsx, .csv)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Replace or update the active dataset sheets (Students, Enrollments, Attendance, Assessments, Fee_Payments).
        </p>

        <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center transition bg-slate-950/50">
          <FileSpreadsheet className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-80" />
          <p className="text-xs font-semibold text-slate-300">
            {file ? file.name : "Drag & drop your Excel file here, or browse files"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Accepts <code className="text-slate-400">02_Education.xlsx</code> or multi-sheet Excel workbooks up to 50MB
          </p>

          <input
            type="file"
            id="fileInput"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-4 flex items-center justify-center space-x-3">
            <label
              htmlFor="fileInput"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition"
            >
              Choose File
            </label>

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition flex items-center space-x-1.5"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Sheets...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload & Ingest</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {uploadSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
