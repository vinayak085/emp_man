import React from 'react';
import {
  Search,
  Plus,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  Mail,
  UserX,
  XCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';

export default function EmployeeTable({
  employees,
  isLoading,
  searchQuery,
  onSearchChange,
  onClearSearch,
  sortBy,
  order,
  onSortChange,
  onAddClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  currentPage,
  pageSize,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Color generator for avatar initials based on name
  const getAvatarGradient = (name = '') => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-violet-500 to-purple-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-cyan-500 to-blue-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Toolbar: Search, Sort, Add Button */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-slate-50/40">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or designation..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              title="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Sort controls and Add button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium hidden sm:inline">Sort:</span>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                onSortChange(newSortBy, newOrder);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="createdAt-desc">Date (Newest first)</option>
              <option value="createdAt-asc">Date (Oldest first)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="designation-asc">Designation (A-Z)</option>
              <option value="designation-desc">Designation (Z-A)</option>
              <option value="email-asc">Email (A-Z)</option>
            </select>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/25 transition cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        // Loading State Skeleton
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading employee records...</span>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        // Empty State
        <div className="py-16 px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <UserX className="w-8 h-8" />
          </div>
          {searchQuery ? (
            <div>
              <h3 className="text-base font-bold text-slate-800">No matching employees found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No records matched your search query &ldquo;<span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;.
                Try refining your keywords or clear the search.
              </p>
              <button
                onClick={onClearSearch}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-slate-800">No employees added yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Get started by creating your first employee profile in the system.
              </p>
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                Add First Employee
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    #
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Employee
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Email Address
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Designation
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Created Date
                  </th>
                  <th scope="col" className="py-3.5 pr-6 pl-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {employees.map((emp, index) => {
                  const serialNum = (currentPage - 1) * pageSize + index + 1;
                  const gradient = getAvatarGradient(emp.name);
                  const initials = getInitials(emp.name);

                  return (
                    <tr
                      key={emp._id || emp.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Serial Number */}
                      <td className="py-4 pl-6 pr-3 font-mono text-xs text-slate-400">
                        {String(serialNum).padStart(2, '0')}
                      </td>

                      {/* Name + Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0`}
                          >
                            {initials}
                          </div>
                          <div>
                            <button
                              onClick={() => onViewClick(emp)}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition text-left cursor-pointer"
                            >
                              {emp.name}
                            </button>
                            <span className="block text-[11px] font-mono text-slate-400">
                              ID: {(emp._id || emp.id).slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-600">
                        <a
                          href={`mailto:${emp.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{emp.email}</span>
                        </a>
                      </td>

                      {/* Designation */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                          {emp.designation}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {formatDate(emp.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                          <button
                            onClick={() => onViewClick(emp)}
                            title="View details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditClick(emp)}
                            title="Edit employee"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteClick(emp)}
                            title="Delete employee"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {employees.map((emp, index) => {
              const serialNum = (currentPage - 1) * pageSize + index + 1;
              const gradient = getAvatarGradient(emp.name);
              const initials = getInitials(emp.name);

              return (
                <div key={emp._id || emp.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0`}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4
                          onClick={() => onViewClick(emp)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer"
                        >
                          {emp.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          #{String(serialNum).padStart(2, '0')} • ID: {(emp._id || emp.id).slice(-6)}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-full">
                      {emp.designation}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.email}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Created: {formatDate(emp.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewClick(emp)}
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditClick(emp)}
                        className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(emp)}
                        className="px-2.5 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
