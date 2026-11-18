export const GROUND_TRUTH_KPIS = {
  summary: {
    total_students: 1200,
    total_enrollments: 1600,
    active_enrollments: 393,
    completed_enrollments: 406,
    dropped_enrollments: 383,
    on_hold_enrollments: 418,
    dropout_rate: 23.94,
    completion_rate: 25.37,
    retention_rate: 76.06
  },
  financials: {
    total_billed_revenue: 58419372.66,
    total_collected_fee: 7637309.78,
    total_pending_fee: 3862177.04,
    total_failed_fee: 3660803.97,
    total_uncollected_fee: 7522981.01,
    fee_collection_efficiency: 50.38,
    payment_methods: { Card: 312, UPI: 312, Cash: 303, "Bank Transfer": 273 }
  },
  academics: {
    overall_attendance_rate: 77.76,
    absenteeism_rate: 15.68,
    attendance_breakdown: { Present: 1944, Absent: 392, Late: 164 },
    avg_assessment_score: 63.15,
    grades_breakdown: { D: 596, C: 439, A: 393, B: 372 },
    submissions_breakdown: { Submitted: 884, Late: 458, Missing: 458 },
    at_risk_grade_pct: 33.11
  },
  course_performance: [
    { course: "Data Analytics", enrollments: 211, completed: 60, dropped: 55, dropout_rate: 26.07, total_revenue: 7888115.4, avg_score: 61.31 },
    { course: "Cyber Security", enrollments: 209, completed: 50, dropped: 56, dropout_rate: 26.79, total_revenue: 7613536.57, avg_score: 63.65 },
    { course: "UI/UX Design", enrollments: 209, completed: 55, dropped: 52, dropout_rate: 24.88, total_revenue: 7106487.02, avg_score: 62.93 },
    { course: "Python Development", enrollments: 207, completed: 51, dropped: 41, dropout_rate: 19.81, total_revenue: 7243668.7, avg_score: 63.3 },
    { course: "AI Engineering", enrollments: 204, completed: 51, dropped: 50, dropout_rate: 24.51, total_revenue: 7881828.65, avg_score: 62.79 },
    { course: "Digital Marketing", enrollments: 195, completed: 50, dropped: 41, dropout_rate: 21.03, total_revenue: 7221736.44, avg_score: 66.96 },
    { course: "Full Stack Development", enrollments: 191, completed: 50, dropped: 46, dropout_rate: 24.08, total_revenue: 7273465.17, avg_score: 63.36 },
    { course: "Cloud Computing", enrollments: 174, completed: 39, dropped: 42, dropout_rate: 24.14, total_revenue: 6190534.71, avg_score: 61.18 }
  ],
  monthly_trends: [
    { month: "2026-05", enrollments: 275, fee_collected: 1409770.94, fee_pending: 1373541.63 },
    { month: "2026-06", enrollments: 258, fee_collected: 1350263.01, fee_pending: 1209673.15 },
    { month: "2026-07", enrollments: 263, fee_collected: 1300268.4, fee_pending: 1146571.75 },
    { month: "2026-08", enrollments: 251, fee_collected: 1227858.12, fee_pending: 1425741.42 },
    { month: "2026-09", enrollments: 278, fee_collected: 1126102.85, fee_pending: 1244658.35 },
    { month: "2026-10", enrollments: 275, fee_collected: 1223046.46, fee_pending: 1122794.71 }
  ],
  delivery_modes: { Online: 557, Offline: 529, Hybrid: 514 },
  demographics: {
    top_cities: { Gandhinagar: 130, Pune: 128, Vadodara: 128, Anand: 128, Rajkot: 127, Surat: 125, Bharuch: 116, Nadiad: 116, Mumbai: 103, Ahmedabad: 99 },
    education_levels: { Professional: 319, Diploma: 306, Undergraduate: 294, Graduate: 281 }
  }
};
