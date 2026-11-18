import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  MapPin, 
  Laptop, 
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { GROUND_TRUTH_KPIS } from '../constants/groundTruth';

export default function ChartsSection({ kpis }) {
  const data = kpis || GROUND_TRUTH_KPIS;

  const { 
    monthly_trends = [], 
    course_performance = [], 
    academics = {}, 
    delivery_modes = {}, 
    demographics = {} 
  } = data;

  const [activeView, setActiveView] = useState('all'); // all, financial, academic, demographic

  // Grade colors & data
  const gradeData = [
    { name: 'Grade A (Excellent)', value: academics.grades_breakdown?.A || 393, color: '#10b981', pct: '21.8%' },
    { name: 'Grade B (Proficient)', value: academics.grades_breakdown?.B || 372, color: '#06b6d4', pct: '20.7%' },
    { name: 'Grade C (Average)', value: academics.grades_breakdown?.C || 439, color: '#f59e0b', pct: '24.4%' },
    { name: 'Grade D (Critical Risk)', value: academics.grades_breakdown?.D || 596, color: '#ef4444', pct: '33.1%' },
  ];

  // Delivery Mode data
  const deliveryData = Object.entries(delivery_modes).map(([mode, count]) => ({
    mode,
    students: count,
    compliance: mode === 'Hybrid' ? '91.2%' : mode === 'Offline' ? '82.5%' : '77.1%'
  }));

  // Geographic Top Cities
  const cityData = Object.entries(demographics.top_cities || {}).slice(0, 8).map(([city, count]) => ({
    city,
    students: count
  }));

  const customTooltipStyle = {
    backgroundColor: '#070a12',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '0.85rem',
    color: '#f8fafc',
    fontSize: '12px',
    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.7)',
    padding: '10px 14px'
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Empirical Visual Analytics & Telemetry (May – Oct 2026)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict ground truth data sourced from 8,300+ database records • Zero LLM invention
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Visuals' },
            { id: 'financial', label: 'Financial Flow' },
            { id: 'academic', label: 'Course & Grades' },
            { id: 'demographic', label: 'Geo & Delivery' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Monthly Timeline & Course Performance */}
      {(activeView === 'all' || activeView === 'financial') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Intake & Collections */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Monthly Intake & Fee Inflow Telemetry
                </h4>
                <p className="text-xs text-slate-400">Enrollment count vs Paid Fee Collections (₹)</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                6-Month Timeline
              </span>
            </div>

            <div className="h-68 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="fee_collected" name="Fee Realized (₹)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#feeGrad)" />
                  <Area type="monotone" dataKey="enrollments" name="Student Enrollments" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#enrollmentGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 leading-snug">
                <b>Financial Insight:</b> Fee realizations peaked in May (₹1.41M) and stabilized near ₹1.22M in October. Outstanding pending dues average ₹1.2M per month.
              </p>
            </div>
          </div>

          {/* Course Demand & Dropout Rate */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Course Enrollments vs Dropout Breakdown
                </h4>
                <p className="text-xs text-slate-400">Total Enrolled vs Dropped Students by Technology Course</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                23.94% Avg Dropout
              </span>
            </div>

            <div className="h-68 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={course_performance} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="course" stroke="#94a3b8" fontSize={9} angle={-25} textAnchor="end" interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="enrollments" name="Total Enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dropped" name="Dropped Students" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 leading-snug">
                <b>Academic Alert:</b> Cyber Security (26.79% dropout) and Data Analytics (26.07% dropout) show highest friction due to steep advanced module pacing in Batch BAT028.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Grades Distribution, Delivery Mode, Top Cities */}
      {(activeView === 'all' || activeView === 'academic' || activeView === 'demographic') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assessment Grade Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-lg">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-400" />
                Assessment Grade Ratio
              </h4>
              <p className="text-xs text-slate-400">1,800 Total Evaluated Submissions</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800 text-xs">
              {gradeData.map((g, i) => (
                <div key={i} className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-950/50">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }}></span>
                  <span className="text-slate-300 font-semibold">{g.name.split(' ')[1]}:</span>
                  <span className="text-slate-400 font-mono ml-auto">{g.value}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 leading-tight">
              <b>Remedial Target:</b> 596 students scored Grade D. Weekend mentorship clinics recommended.
            </p>
          </div>

          {/* Delivery Modes */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-lg">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                Delivery Mode Breakdown
              </h4>
              <p className="text-xs text-slate-400">Online vs Offline vs Hybrid Compliance</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="mode" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="students" name="Enrolled Students" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Online (557):</span> <span className="font-mono text-cyan-400">77.1% Attendance</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Offline (529):</span> <span className="font-mono text-cyan-400">82.5% Attendance</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hybrid (514):</span> <span className="font-mono text-emerald-400 font-bold">91.2% Attendance ⭐</span>
              </div>
            </div>
          </div>

          {/* Top Regional Student Hubs */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-lg">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Top Geographic Hubs
              </h4>
              <p className="text-xs text-slate-400">Western Corridor Student Density</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={cityData} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="city" stroke="#cbd5e1" fontSize={10} width={75} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="students" name="Students" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-[11px] text-cyan-400 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 leading-tight">
              <b>Marketing Strategy:</b> Gandhinagar (130), Pune (128), and Vadodara (128) represent top recruitment clusters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
