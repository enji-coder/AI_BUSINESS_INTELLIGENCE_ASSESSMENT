import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  Database,
  Building2,
  Activity
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
    <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Brand & Organization Title */}
      <div className="flex items-center space-x-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              EduIntel <span className="text-cyan-400 font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-700/60 font-bold">DECISION AI</span>
            </h1>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-xs font-semibold text-slate-300 hidden md:flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              {profile?.institute_name || "Apex Institute of Advanced Technology"}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
            <span className="text-cyan-400 font-semibold">Institute & Student Performance Intelligence</span>
            <span>•</span>
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5 shadow-sm shadow-emerald-400/50"></span>
              Neon PostgreSQL Connected • 8,300 Records Active
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button & User Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Run Multi-Agent Crew */}
        <button
          onClick={onTriggerAgents}
          disabled={isAgentRunning}
          className={`relative group overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all flex items-center space-x-2 border ${
            isAgentRunning 
              ? 'bg-slate-900 text-slate-400 border-slate-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white border-cyan-300/30 shadow-cyan-500/30 active:scale-95'
          }`}
        >
          {isAgentRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>6 Agents Analyzing Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Execute 6-Agent Swarm</span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">1-Click</span>
            </>
          )}
        </button>

        {/* User Account Pill */}
        {currentUser ? (
          <div className="flex items-center space-x-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-1.5 shadow-inner">
            <button 
              onClick={onOpenProfile} 
              className="flex items-center space-x-2.5 text-left hover:text-cyan-400 transition"
              title="Edit Profile & Strategic Goals"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-1 ring-white/20 shadow">
                {currentUser.full_name?.charAt(0) || 'D'}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-white leading-none">{currentUser.full_name}</p>
                <p className="text-[10px] text-cyan-400 font-mono leading-none mt-1">{currentUser.role || 'Director'}</p>
              </div>
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 p-1 transition ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Director Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
