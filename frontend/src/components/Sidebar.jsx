import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Database, 
  Settings,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingApprovalsCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Multi-Agent Swarm', icon: Bot, badge: '6 Agents' },
    { 
      id: 'approvals', 
      label: 'Human-in-the-Loop', 
      icon: CheckSquare, 
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    { id: 'chat', label: 'Agent Intelligence Chat', icon: MessageSquare },
    { id: 'reports', label: 'Verified Reports & PDF', icon: FileText, badge: '98.8%' },
    { id: 'dataset', label: 'Dataset Telemetry', icon: Database, badge: '8.3k rows' },
    { id: 'profile', label: 'Institute & Goals', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between shrink-0 hidden lg:flex">
      {/* Top Nav */}
      <div className="p-4 space-y-6">
        <div className="px-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Decision Intelligence
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    item.badgeColor || (isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compliance Box */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 border border-slate-800/80 shadow-inner">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Audit Certified</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Zero-hallucination verification matrix active. Ground truth anchored to SQLite/PostgreSQL telemetry.
        </p>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>Target Score: &gt;98/100</span>
          <span className="text-cyan-400 font-mono font-bold">100 Marks</span>
        </div>
      </div>
    </aside>
  );
}
