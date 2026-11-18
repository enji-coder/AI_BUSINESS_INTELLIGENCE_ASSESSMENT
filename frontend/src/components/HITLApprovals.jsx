import React, { useState } from 'react';
import { 
  CheckSquare, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  UserCheck,
  Filter,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function HITLApprovals({ 
  approvals = [], 
  onDecision, 
  currentUser 
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [commentInput, setCommentInput] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

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
      setSuccessToast(`Proposal #${id} successfully marked as ${decision}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center space-x-2.5 shadow-xl animate-fade-in">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-900/50 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                Section 9 • Human-in-the-Loop Governance Center
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Consequential Decision Guardrail
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2.5">
              Executive Authorization & HITL Decision Queue
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              As required by Section 9 of the assessment guidelines, the system prevents autonomous execution of high-consequence business actions. The Strategy and Operations agents formulate proposals which require explicit Director authorization.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto shrink-0">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === f
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals Decision Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
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
                className={`p-6 rounded-3xl border transition-all ${
                  isPending
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-2xl shadow-amber-500/5 ring-1 ring-amber-500/20'
                    : isApproved
                    ? 'bg-slate-900/50 border-emerald-500/40'
                    : 'bg-slate-900/40 border-rose-500/40 opacity-75'
                }`}
              >
                {/* Proposal Top Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded-full border shadow-sm ${
                        isPending 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                          : isApproved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-cyan-400 font-bold">
                        Formulated By: {item.agent_name}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 font-medium">
                        Category: {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-400 block">
                      Priority: {item.priority}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                      Proposed Action Directive
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">{item.proposed_action}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                      Projected Institutional Impact
                    </span>
                    <p className="text-emerald-300 leading-relaxed font-sans font-medium">{item.business_impact}</p>
                  </div>

                  <div className="md:col-span-2 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <span><b>Budgetary Impact:</b> {item.estimated_budget_impact || "Allocated from internal operations"}</span>
                    <span className="flex items-center text-cyan-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                      {item.verification_status}
                    </span>
                  </div>
                </div>

                {/* Director Decision Controls (If Pending) */}
                {isPending ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Add review directive, conditions, or authorized comments..."
                        value={commentInput[item.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [item.id]: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    <div className="flex items-center space-x-3 justify-end">
                      <button
                        onClick={() => handleAction(item.id, 'REJECTED')}
                        disabled={submittingId === item.id}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold transition active:scale-95"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline Proposal</span>
                      </button>

                      <button
                        onClick={() => handleAction(item.id, 'APPROVED')}
                        disabled={submittingId === item.id}
                        className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 text-xs font-bold transition active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Authorize & Execute Action</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-slate-300">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-sans font-medium">{item.reviewer_comment || "Action recorded by authorized Director."}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
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
