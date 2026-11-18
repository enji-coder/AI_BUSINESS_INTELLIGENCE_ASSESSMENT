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
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  FileSpreadsheet, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kpis, setKpis] = useState(null);
  const [runs, setRuns] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [reports, setReports] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [datasetStatus, setDatasetStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(api.getCurrentUser());

  // Modals & UI states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [selectedRunLogs, setSelectedRunLogs] = useState([]);

  // Load Initial Data
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
      if (runsData) setRuns(runsData);
      if (approvalsData) setApprovals(approvalsData);
      if (reportsData) setReports(reportsData);
      if (chatData) setChatHistory(chatData);
      if (statusData) setDatasetStatus(statusData);
      if (profileData) setProfile(profileData);

      if (runsData && runsData.length > 0) {
        setSelectedRunId(runsData[0].run_id);
        const logs = await api.getAgentLogs(runsData[0].run_id).catch(() => []);
        setSelectedRunLogs(logs);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingInitial(false);
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
      alert(`Agent execution failed: ${err.message}`);
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

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
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
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Executive Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome & Directive Hero */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold">
                        Education Intelligence System • 100 Marks Assessment
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Target: &gt;98/100
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                      Apex Institute of Advanced Technology
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      AI-Powered Business Operations & Decision Intelligence System orchestrating 6 specialized agents: 
                      <b className="text-cyan-400"> Data Analyst</b>, <b className="text-purple-400">Marketing</b>, <b className="text-emerald-400">Finance</b>, <b className="text-amber-400">Operations</b>, <b className="text-fuchsia-400">Strategy</b>, and <b className="text-rose-400">Verification</b>.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
                    >
                      <span>View Audited Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleTriggerAgents}
                      disabled={isAgentRunning}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition flex items-center space-x-1.5 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>{isAgentRunning ? 'Agents Running...' : 'Run Swarm'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <KPICards kpis={kpis} />

              {/* Interactive Charts */}
              <ChartsSection kpis={kpis} />
            </div>
          )}

          {/* Multi-Agent Swarm Monitor Tab */}
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
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl backdrop-blur-xl max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-white">Business Profile Settings</h3>
              <p className="text-xs text-slate-400">Configure institute metrics, team capacity, and core strategic objectives.</p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Institute Name</span>
                  <span className="text-white font-semibold text-sm">{profile?.institute_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Industry Focus</span>
                  <span className="text-cyan-400 font-semibold">{profile?.industry}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Faculty & Team Size</span>
                  <span className="text-white">{profile?.team_size}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Capacity</span>
                  <span className="text-white font-mono">{profile?.student_capacity} Students</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Core Business Goals</span>
                  <span className="text-slate-300 leading-relaxed block mt-1">{profile?.business_goals}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold"
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
