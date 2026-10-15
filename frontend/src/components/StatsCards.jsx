import React from 'react';
import { Users, Briefcase, CalendarCheck, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats, totalRecords, isLoading }) {
  const cards = [
    {
      title: 'Total Employees',
      value: totalRecords ?? stats?.totalEmployees ?? 0,
      icon: Users,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'Active Directory',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Unique Designations',
      value: stats?.uniqueDesignationsCount ?? 0,
      icon: Briefcase,
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'Job Roles',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: 'Added Last 30 Days',
      value: stats?.recentEmployeesCount ?? 0,
      icon: CalendarCheck,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'Recent Hires',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isLoading ? '...' : card.value}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl border ${card.bgColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
