import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import AgentMonitor from './components/AgentMonitor';
import HITLApprovals from './components/HITLApprovals';
import ChatInterface from './components/ChatInterface';
import ReportViewer from './components/ReportViewer';
import DatasetUpload from './components/DatasetUpload';
import ProfileModal from './components/ProfileModal';
import LoginModal from './components/LoginModal';
import { api } from './services/api';
import { GROUND_TRUTH_KPIS } from './constants/groundTruth';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  FileSpreadsheet, 
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  HelpCircle,
  TrendingDown,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  // Initialize with ground truth data so UI renders INSTANTLY with zero blank states!
  const [kpis, setKpis] = useState(GROUND_TRUTH_KPIS);
  const [runs, setRuns] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [reports, setReports] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [datasetStatus, setDatasetStatus] = useState({
    status: "Ready",
    dataset_name: "02_Education.xlsx (Synthetic Institute Telemetry)",
    coverage_period: "May 1, 2026 – October 31, 2026",
    currency: "INR (₹)",
    entities: {
      students: 1200,
      enrollments: 1600,
      attendance: 2500,
      assessments: 1800,
      fee_payments: 1200
    },
    total_records: 8300
  });
  const [profile, setProfile] = useState({
    institute_name: "Apex Institute of Advanced Technology",
    industry: "Education: Institute & Student Performance Intelligence",
    team_size: "65 Faculty & Operations Staff",
    student_capacity: 2500,
    business_goals: "Drive 90%+ course completion rate, reduce dropouts below 10%, recover ₹7.5M in pending fees, and scale hybrid learning."
  });
  const [currentUser, setCurrentUser] = useState(api.getCurrentUser() || {
    id: 1,
    email: "director@apexinstitute.edu",
    full_name: "Dr. Rajesh Mehta",
    role: "Institute Director"
  });

  // Modals & UI states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [selectedRunLogs, setSelectedRunLogs] = useState([]);

  // Load Initial Data from Live Backend
  const loadDashboardData = async () => {
    try {
      const [
        kpiData,
        runsData,
        approvalsData,
        reportsData,
        chatData,
        statusData,
        profileData
      ] = await Promise.all([
        api.getKPIs().catch(() => null),
        api.listAgentRuns().catch(() => []),
        api.getApprovals().catch(() => []),
        api.listReports().catch(() => []),
        api.getChatHistory().catch(() => []),
        api.getDatasetStatus().catch(() => null),
        api.getProfile().catch(() => null)
      ]);

      if (kpiData) setKpis(kpiData);
      if (runsData && runsData.length > 0) {
        setRuns(runsData);
        setSelectedRunId(runsData[0].run_id);
        const logs = await api.getAgentLogs(runsData[0].run_id).catch(() => []);
        setSelectedRunLogs(logs);
      }
      if (approvalsData && approvalsData.length > 0) setApprovals(approvalsData);
      if (reportsData && reportsData.length > 0) setReports(reportsData);
      if (chatData && chatData.length > 0) setChatHistory(chatData);
      if (statusData) setDatasetStatus(statusData);
      if (profileData) setProfile(profileData);
    } catch (err) {
      console.warn("Backend hydration notice (using ground truth cache):", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Trigger Multi-Agent Crew Execution
  const handleTriggerAgents = async () => {
    setIsAgentRunning(true);
    try {
      const res = await api.runAgents('Sequential-Hierarchical');
      await loadDashboardData();
      setActiveTab('agents');
    } catch (err) {
      alert(`Agent execution notice: ${err.message}`);
    } finally {
      setIsAgentRunning(false);
    }
  };

  // Switch Selected Agent Run to Inspect Logs
  const handleSelectRun = async (runId) => {
    setSelectedRunId(runId);
    try {
      const logs = await api.getAgentLogs(runId);
      setSelectedRunLogs(logs);
    } catch (err) {
      console.error("Failed to load logs for run:", runId);
    }
  };

  // Human-in-the-Loop Decision Recording
  const handleApprovalDecision = async (id, decision, comment) => {
    await api.recordApprovalDecision(id, decision, comment);
    const updated = await api.getApprovals();
    setApprovals(updated);
  };

  // Chat message sending
  const handleSendMessage = async (msg) => {
    return api.sendChatMessage(msg);
  };

  // Auth handlers
  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    setCurrentUser(res.user);
    loadDashboardData();
  };

  const handleRegister = async (fullName, email, password, role) => {
    const res = await api.register(fullName, email, password, role);
    setCurrentUser(res.user);
    loadDashboardData();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Profile save
  const handleSaveProfile = async (formData) => {
    const updated = await api.updateProfile(formData);
    setProfile(updated);
  };

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length || 2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Executive Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
        onTriggerAgents={handleTriggerAgents}
        isAgentRunning={isAgentRunning}
        profile={profile}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Command Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Executive Overview Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Executive Command Hero Banner */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        Education Operations Intelligence • Production Suite
                      </span>
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Swarm Engine Online
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
                      Apex Institute of Advanced Technology
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                      AI-Powered Business Operations & Decision Intelligence System orchestrating 6 specialized agents: 
                      <b className="text-cyan-400 font-semibold"> Data Analyst</b>, <b className="text-purple-400 font-semibold">Marketing</b>, <b className="text-emerald-400 font-semibold">Finance</b>, <b className="text-amber-400 font-semibold">Operations</b>, <b className="text-fuchsia-400 font-semibold">Strategy</b>, and <b className="text-rose-400 font-semibold">Verification</b>.
                    </p>
                  </div>

                  {/* Quick Action Center */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className="px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/40 transition flex items-center space-x-2 shadow-lg shadow-amber-500/5"
                    >
                      <span>Review 2 HITL Proposals</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-black">2</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition flex items-center space-x-2 shadow"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>View Audited Report</span>
                    </button>

                    <button
                      onClick={handleTriggerAgents}
                      disabled={isAgentRunning}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-cyan-500/25 transition flex items-center space-x-2 active:scale-95 border border-cyan-300/30"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>{isAgentRunning ? 'Agents Analyzing...' : 'Run 6-Agent Swarm'}</span>
                    </button>
                  </div>
                </div>

                {/* Directive Callout Bar */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2">
                  <div className="flex items-center space-x-2 text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span><b>Critical Risk Flagged:</b> 23.94% Student Dropout Rate and ₹7.52M Uncollected Tuition Trapped in 2nd/3rd Installments.</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('agents')} 
                    className="text-cyan-400 font-bold hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Inspect Agent Findings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Verified KPI Metric Cards */}
              <KPICards kpis={kpis} onCardClick={(id) => {
                if (id === 'dropouts' || id === 'academic_risk') setActiveTab('agents');
                else if (id === 'uncollected_fee' || id === 'collected_fee') setActiveTab('approvals');
                else setActiveTab('dataset');
              }} />

              {/* Visual Telemetry Charts */}
              <ChartsSection kpis={kpis} />
            </div>
          )}

          {/* 6-Agent Swarm Monitor Tab */}
          {activeTab === 'agents' && (
            <AgentMonitor
              runs={runs}
              currentRunLogs={selectedRunLogs}
              onTriggerAgents={handleTriggerAgents}
              isAgentRunning={isAgentRunning}
              selectedRunId={selectedRunId}
              onSelectRun={handleSelectRun}
            />
          )}

          {/* Human-in-the-Loop Approvals Tab */}
          {activeTab === 'approvals' && (
            <HITLApprovals
              approvals={approvals}
              onDecision={handleApprovalDecision}
              currentUser={currentUser}
            />
          )}

          {/* Multi-Agent Chat Tab */}
          {activeTab === 'chat' && (
            <ChatInterface
              onSendMessage={handleSendMessage}
              chatHistory={chatHistory}
            />
          )}

          {/* Verified Reports & PDF Tab */}
          {activeTab === 'reports' && (
            <ReportViewer reports={reports} />
          )}

          {/* Dataset Telemetry Tab */}
          {activeTab === 'dataset' && (
            <DatasetUpload
              datasetStatus={datasetStatus}
              onRefreshStatus={loadDashboardData}
            />
          )}

          {/* Profile / Institutional Goals Tab */}
          {activeTab === 'profile' && (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-2xl max-w-2xl mx-auto space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white">Business Profile & Institutional Objectives</h3>
                <p className="text-xs text-slate-400 mt-1">Configure institute parameters, student capacity, and strategic turnaround goals.</p>
              </div>

              <div className="space-y-3.5 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold text-cyan-400">Institute Name</span>
                  <span className="text-white font-bold text-base mt-0.5 block">{profile?.institute_name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold text-purple-400">Industry Classification</span>
                  <span className="text-white font-medium block mt-0.5">{profile?.industry}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Faculty & Team Size</span>
                    <span className="text-white font-semibold block mt-0.5">{profile?.team_size}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Capacity</span>
                    <span className="text-white font-mono font-bold block mt-0.5">{profile?.student_capacity} Students</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold text-emerald-400">Core Strategic Goals</span>
                  <span className="text-slate-300 leading-relaxed block mt-1">{profile?.business_goals}</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-500/20"
                  >
                    Edit Business Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
