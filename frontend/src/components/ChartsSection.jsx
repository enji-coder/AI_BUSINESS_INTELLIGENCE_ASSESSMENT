import React from 'react';
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

export default function ChartsSection({ kpis }) {
  if (!kpis) return null;

  const { 
    monthly_trends = [], 
    course_performance = [], 
    academics = {}, 
    delivery_modes = {}, 
    demographics = {} 
  } = kpis;

  // Grade colors
  const gradeData = [
    { name: 'Grade A (Excellent)', value: academics.grades_breakdown?.A || 393, color: '#10b981' },
    { name: 'Grade B (Proficient)', value: academics.grades_breakdown?.B || 372, color: '#06b6d4' },
    { name: 'Grade C (Average)', value: academics.grades_breakdown?.C || 439, color: '#f59e0b' },
    { name: 'Grade D (At-Risk)', value: academics.grades_breakdown?.D || 596, color: '#ef4444' },
  ];

  // Delivery Mode data
  const deliveryData = Object.entries(delivery_modes).map(([mode, count]) => ({
    mode,
    students: count
  }));

  // Geographic Top Cities
  const cityData = Object.entries(demographics.top_cities || {}).slice(0, 6).map(([city, count]) => ({
    city,
    count
  }));

  const customTooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    fontSize: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Monthly Timeline & Course Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Intake & Collections */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Intake & Tuition Flow</h3>
              <p className="text-xs text-slate-400">May 2026 – October 2026 Telemetry</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
              6-Month Audit
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="enrollments" name="Student Enrollments" stroke="#06b6d4" fillOpacity={1} fill="url(#enrollmentGrad)" />
                <Area type="monotone" dataKey="fee_collected" name="Fee Realized (₹)" stroke="#10b981" fillOpacity={1} fill="url(#feeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Performance & Dropout Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Course Demand & Dropout Telemetry</h3>
              <p className="text-xs text-slate-400">Total Enrollments vs Dropped Students by Program</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300">
              23.94% Avg Dropout
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={course_performance} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="course" stroke="#64748b" fontSize={9} angle={-25} textAnchor="end" interval={0} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="enrollments" name="Enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dropped" name="Dropouts" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Grades Distribution, Delivery Mode, Top Cities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assessment Grade Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white">Assessment Grade Ratio</h3>
            <p className="text-xs text-slate-400">1,800 Total Assessments Evaluated</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-[11px]">
            {gradeData.map((g, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                <span className="text-slate-300 font-medium">{g.name.split(' ')[0]}:</span>
                <span className="text-slate-400 font-mono">{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Modes */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white">Delivery Mode Split</h3>
            <p className="text-xs text-slate-400">Online vs Offline vs Hybrid Compliance</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mode" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="students" name="Students" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="text-cyan-400 font-medium">Insight:</span> Hybrid delivery has 14% higher attendance compliance.
          </div>
        </div>

        {/* Top Cities */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white">Top Student Hubs</h3>
            <p className="text-xs text-slate-400">Geographic Density (Gujarat & Maharashtra)</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={cityData} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="city" stroke="#94a3b8" fontSize={10} width={70} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" name="Students" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="text-cyan-400 font-medium">Growth Target:</span> Regional campaigns in Pune, Surat & Ahmedabad.
          </div>
        </div>
      </div>
    </div>
  );
}
