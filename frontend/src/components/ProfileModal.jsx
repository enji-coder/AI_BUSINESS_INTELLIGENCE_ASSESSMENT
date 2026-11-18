import React, { useState } from 'react';
import { X, Building2, Target, Users, GraduationCap, Save } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, profile, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    institute_name: profile?.institute_name || "Apex Institute of Advanced Technology",
    industry: profile?.industry || "Education: Institute & Student Performance Intelligence",
    team_size: profile?.team_size || "65 Faculty & Operations Staff",
    student_capacity: profile?.student_capacity || 2500,
    business_goals: profile?.business_goals || "Drive 90%+ course completion rate, reduce dropouts below 10%, recover ₹7.5M in pending fees, and scale hybrid learning."
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Business Profile & Institutional Goals</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Institute / Company Name</label>
            <input
              type="text"
              value={formData.institute_name}
              onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Focus</label>
              <input
                type="text"
                value={formData.industry}
                disabled
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-cyan-400 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty & Team Size</label>
              <input
                type="text"
                value={formData.team_size}
                onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Student Capacity</label>
            <input
              type="number"
              value={formData.student_capacity}
              onChange={(e) => setFormData({ ...formData, student_capacity: parseInt(e.target.value) || 2000 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Strategic Academic & Financial Goals</label>
            <textarea
              rows={3}
              value={formData.business_goals}
              onChange={(e) => setFormData({ ...formData, business_goals: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
