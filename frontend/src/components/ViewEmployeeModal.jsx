import React, { useState } from 'react';
import { X, User, Mail, Briefcase, Calendar, Hash, Copy, Check, Edit2 } from 'lucide-react';

export default function ViewEmployeeModal({ isOpen, onClose, employee, onEdit }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !employee) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Generate color initials avatar
  const initials = employee.name
    ? employee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EM';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Banner with Avatar */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 pt-8 pb-16 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span>Employee Record</span>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-6 relative -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold tracking-wider">
                {initials}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
          <span className="inline-block mt-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {employee.designation}
          </span>

          {/* Details Grid */}
          <div className="mt-6 space-y-3.5">
            {/* Email */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <a
                    href={`mailto:${employee.email}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {employee.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(employee.email, 'email')}
                title="Copy email"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Designation */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role / Title</p>
                <p className="text-sm font-medium text-slate-800">{employee.designation}</p>
              </div>
            </div>

            {/* Employee ID */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">MongoDB ID</p>
                  <p className="text-xs font-mono font-medium text-slate-700">{employee._id || employee.id}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(employee._id || employee.id, 'id')}
                title="Copy ID"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Created Date</p>
                <p className="text-xs font-medium text-slate-700">{formatDate(employee.createdAt)}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Last Updated</p>
                <p className="text-xs font-medium text-slate-700">{formatDate(employee.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
