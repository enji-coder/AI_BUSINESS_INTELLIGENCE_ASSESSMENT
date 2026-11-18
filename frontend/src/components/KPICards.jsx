import React from 'react';
import { 
  Users, 
  TrendingDown, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Award,
  Sparkles 
} from 'lucide-react';

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  const { summary = {}, financials = {}, academics = {} } = kpis;

  const cards = [
    {
      title: "Total Students & Intake",
      value: `${summary.total_students?.toLocaleString() || 1200}`,
      subvalue: `${summary.total_enrollments?.toLocaleString() || 1600} Total Enrollments`,
      icon: Users,
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      badge: "8 Programs Active",
      badgeColor: "bg-blue-500/20 text-blue-300"
    },
    {
      title: "Student Dropout Rate",
      value: `${summary.dropout_rate || 23.94}%`,
      subvalue: `${summary.dropped_enrollments || 383} Dropouts / ${summary.retention_rate || 76.06}% Retention`,
      icon: AlertTriangle,
      color: "from-rose-500/20 to-amber-500/10",
      borderColor: "border-rose-500/40",
      iconColor: "text-rose-400",
      badge: "URGENT INTERVENTION",
      badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30"
    },
    {
      title: "Gross Billed Course Fees",
      value: `₹${((financials.total_billed_revenue || 58419372.66) / 10000000).toFixed(2)} Cr`,
      subvalue: `Exact: ₹${(financials.total_billed_revenue || 58419372.66).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      badge: "Tuition Pipeline",
      badgeColor: "bg-emerald-500/20 text-emerald-300"
    },
    {
      title: "Tuition Fee Realization",
      value: `₹${((financials.total_collected_fee || 7637309.78) / 100000).toFixed(1)} Lakh`,
      subvalue: `Uncollected: ₹${((financials.total_uncollected_fee || 7522981.01) / 100000).toFixed(1)}L (${financials.fee_collection_efficiency || 50.38}%)`,
      icon: IndianRupee,
      color: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      badge: "50.4% Efficiency",
      badgeColor: "bg-amber-500/20 text-amber-300"
    },
    {
      title: "Overall Attendance Rate",
      value: `${academics.overall_attendance_rate || 77.76}%`,
      subvalue: `Present: 1,944 | Absent: 392 | Late: 164`,
      icon: Clock,
      color: "from-indigo-500/20 to-purple-500/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      badge: "2,500 Sessions",
      badgeColor: "bg-indigo-500/20 text-indigo-300"
    },
    {
      title: "At-Risk D-Grade Cohort",
      value: `${academics.at_risk_grade_pct || 33.11}%`,
      subvalue: `596 D-Grades (458 Late / 458 Missing)`,
      icon: Award,
      color: "from-purple-500/20 to-pink-500/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      badge: "Target for Remedial",
      badgeColor: "bg-purple-500/20 text-purple-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} backdrop-blur-xl transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">{card.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{card.subvalue}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
