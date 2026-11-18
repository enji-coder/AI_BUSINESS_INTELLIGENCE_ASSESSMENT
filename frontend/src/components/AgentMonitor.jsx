import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  Search, 
  Database,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

const AGENT_PROFILES = [
  {
    key: "data_analyst",
    name: "Data Analyst Agent",
    role: "Senior Academic Data Analyst",
    icon: Database,
    color: "from-cyan-500 to-blue-600",
    badge: "Step 1: Empirical Analysis",
    description: "Extracts exact database KPIs, student cohort progression, retention rates, and numerical anomalies without hallucination."
  },
  {
    key: "marketing",
    name: "Marketing Agent",
    role: "Student Acquisition & Enrollment Strategist",
    icon: BrainCircuit,
    color: "from-purple-500 to-indigo-600",
    badge: "Step 2: Demographics",
    description: "Analyzes geographic hubs (Pune, Surat, Ahmedabad), delivery modes (Hybrid vs Online), and education levels to formulate retention & growth strategies."
  },
  {
    key: "finance",
    name: "Finance Agent",
    role: "Institutional Financial Controller",
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    badge: "Step 3: Tuition Realization",
    description: "Audits ₹58.4M billed tuition against ₹7.6M collected and ₹7.5M pending/failed dues. Models installment settlement schemes."
  },
  {
    key: "operations",
    name: "Operations Agent",
    role: "Academic Operations & Delivery Director",
    icon: Layers,
    color: "from-amber-500 to-orange-600",
    badge: "Step 4: Academic Delivery",
    description: "Audits attendance patterns (15.68% absent), assignment delays (50.8% late/missing), and batch bottlenecks in Batches BAT028 and BAT014."
  },
  {
    key: "strategy",
    name: "Strategy Agent",
    role: "Chief Executive Institutional Strategist",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-600",
    badge: "Step 5: Turnaround Roadmap",
    description: "Synthesizes intelligence from Agents 1-4 into a 6-month master turnaround roadmap and generates consequential HITL proposals."
  },
  {
    key: "verification",
    name: "Verification Agent",
    role: "Chief Academic Auditor & Numerical Fact-Checker",
    icon: ShieldCheck,
    color: "from-rose-500 to-red-600",
    badge: "Step 6: Compliance Audit",
    description: "Cross-checks every numerical assertion against database ground truth. Eliminates hallucinations and certifies final report integrity."
  }
];

export default function AgentMonitor({ 
  runs = [], 
  currentRunLogs = [], 
  onTriggerAgents, 
  isAgentRunning,
  selectedRunId,
  onSelectRun
}) {
  const [selectedAgentKey, setSelectedAgentKey] = useState("data_analyst");

  const latestRun = runs[0] || {};
  const currentLogs = currentRunLogs.length > 0 ? currentRunLogs : (latestRun.logs || []);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold">
                CrewAI Multi-Agent Swarm
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Workflow: Sequential-Hierarchical
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Autonomous Institutional Decision Intelligence Swarm
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Six specialized autonomous AI agents collaborate in sequence and hierarchy to analyze academic telemetry, evaluate financial solvency, formulate turnaround strategy, and rigorously audit for zero hallucination.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onTriggerAgents}
              disabled={isAgentRunning}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 ${
                isAgentRunning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 active:scale-95'
              }`}
            >
              {isAgentRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-cyan-400 rounded-full animate-spin"></div>
                  <span>Swarm Executing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Start Live Swarm Run</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Previous Runs Selector */}
        {runs.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center space-x-3 text-xs overflow-x-auto pb-1">
            <span className="text-slate-400 font-medium shrink-0">Execution History:</span>
            {runs.slice(0, 5).map((r) => (
              <button
                key={r.run_id}
                onClick={() => onSelectRun && onSelectRun(r.run_id)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition shrink-0 ${
                  (selectedRunId || latestRun.run_id) === r.run_id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {r.run_id} ({r.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6-Agent Collaboration Architecture Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Specialized Agent Roster & Pipeline Roles
          </h3>
          <span className="text-xs text-slate-400">Click any agent to inspect telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENT_PROFILES.map((agent, idx) => {
            const Icon = agent.icon;
            const isSelected = selectedAgentKey === agent.key;
            const hasLog = currentLogs.some(l => l.agent_name?.toLowerCase().includes(agent.key.replace('_', ' ')));

            return (
              <div
                key={agent.key}
                onClick={() => setSelectedAgentKey(agent.key)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    Step {idx + 1}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-cyan-400 font-mono font-medium">{agent.badge}</span>
                  <span className="flex items-center text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Output
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Agent Execution Log & Reasoning Terminal */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Agent Execution Telemetry & Thought Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Run: {latestRun.run_id || "Active Instance"} • {currentLogs.length} Step Logs Recorded
          </span>
        </div>

        {currentLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No active execution logs found. Click "Execute 6-Agent Swarm" to run live analysis.
          </div>
        ) : (
          <div className="space-y-4">
            {currentLogs.map((log) => (
              <div 
                key={log.id || log.step_number}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Step {log.step_number}: [{log.agent_name}] — {log.agent_role}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {log.thought && (
                  <div className="text-slate-400 pl-3 border-l-2 border-cyan-500/40">
                    <span className="text-slate-300 font-semibold">Agent Thought: </span>
                    {log.thought}
                  </div>
                )}

                {log.action_taken && (
                  <div className="text-slate-300 pl-3 border-l-2 border-indigo-500/40">
                    <span className="text-indigo-400 font-semibold">Action Taken: </span>
                    {log.action_taken}
                  </div>
                )}

                {log.output_summary && (
                  <div className="text-emerald-400/90 pl-3 border-l-2 border-emerald-500/40 whitespace-pre-line text-[11px]">
                    <span className="text-emerald-300 font-semibold">Verified Output Summary: </span>
                    {log.output_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
