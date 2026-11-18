import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  Play, 
  FileDown,
  Database
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onOpenLogin, 
  onLogout, 
  onOpenProfile, 
  onTriggerAgents,
  isAgentRunning,
  profile
}) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Brand & Industry */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              EduIntel <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60">AI 2.0</span>
            </h1>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">
              {profile?.institute_name || "Apex Institute of Advanced Technology"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-cyan-400/90 font-medium">Education Intelligence</span>
            <span>•</span>
            <span className="flex items-center text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
              May – Oct 2026 Dataset Active
            </span>
          </div>
        </div>
      </div>

      {/* Actions & User Controls */}
      <div className="flex items-center space-x-3">
        {/* Trigger Multi-Agent Crew */}
        <button
          onClick={onTriggerAgents}
          disabled={isAgentRunning}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
            isAgentRunning 
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 border border-cyan-400/30 active:scale-95'
          }`}
        >
          {isAgentRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-cyan-400 rounded-full animate-spin"></div>
              <span>6 Agents Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Execute 6-Agent Swarm</span>
            </>
          )}
        </button>

        {/* User Account */}
        {currentUser ? (
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1">
            <button 
              onClick={onOpenProfile} 
              className="flex items-center space-x-2 text-left hover:text-cyan-400 transition"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                {currentUser.full_name?.charAt(0) || 'D'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.full_name}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">{currentUser.role || 'Director'}</p>
              </div>
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 ml-1 p-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Director Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
