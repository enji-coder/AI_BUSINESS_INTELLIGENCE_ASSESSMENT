import React, { useState } from 'react';
import { 
  CheckSquare, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  UserCheck,
  MessageSquareQuote,
  Filter
} from 'lucide-react';

export default function HITLApprovals({ 
  approvals = [], 
  onDecision, 
  currentUser 
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [commentInput, setCommentInput] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const filtered = approvals.filter(item => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const handleAction = async (id, decision) => {
    setSubmittingId(id);
    const comment = commentInput[id] || '';
    try {
      await onDecision(id, decision, comment);
      setCommentInput(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-900/40 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-semibold">
                Section 9 • Human-in-the-Loop Governance
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Consequential Decision Guardrail
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Executive Authorization & HITL Decision Center
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Autonomous AI agents identify bottlenecks and formulate high-impact policies, but consequential budget reallocations and academic interventions require mandatory Director sign-off before automated execution.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === f
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
            No proposals found in the "{filter}" category.
          </div>
        ) : (
          filtered.map((item) => {
            const isPending = item.status === 'PENDING';
            const isApproved = item.status === 'APPROVED';
            const isRejected = item.status === 'REJECTED';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-slate-900/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : isApproved
                    ? 'bg-slate-900/40 border-emerald-500/30'
                    : 'bg-slate-900/40 border-rose-500/30 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isPending 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' 
                          : isApproved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-cyan-400 font-medium">
                        Origin: {item.agent_name}
                      </span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400">
                        Category: {item.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Priority: <b className="text-rose-400">{item.priority}</b>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Proposed: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Proposed Action</span>
                    <p className="text-slate-200">{item.proposed_action}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Expected Business Impact</span>
                    <p className="text-emerald-400">{item.business_impact}</p>
                  </div>
                  <div className="md:col-span-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <span><b>Budget Implication:</b> {item.estimated_budget_impact || "Within existing operational budget"}</span>
                    <span className="flex items-center text-cyan-400">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                      {item.verification_status}
                    </span>
                  </div>
                </div>

                {/* Director Decision Controls (If Pending) */}
                {isPending ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add review directive, conditions, or reason..."
                        value={commentInput[item.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [item.id]: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => handleAction(item.id, 'REJECTED')}
                        disabled={submittingId === item.id}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Proposal</span>
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'APPROVED')}
                        disabled={submittingId === item.id}
                        className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 text-xs font-semibold transition active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize & Execute</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>{item.reviewer_comment || "Action recorded by authorized Director."}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.reviewed_at ? new Date(item.reviewed_at).toLocaleString() : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
