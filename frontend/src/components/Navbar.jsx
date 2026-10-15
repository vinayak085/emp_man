import React from 'react';
import { Users, Database, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Navbar({ dbStatus, onRefresh, isRefreshing }) {
  const isConnected = dbStatus === 'connected';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Employee Management System
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              MERN Stack • MongoDB Atlas • Express • React • Node
            </p>
          </div>
        </div>

        {/* Right: DB Status and Refresh */}
        <div className="flex items-center gap-3">
          {/* Database connection badge */}
          <div
            title={`MongoDB Database Status: ${dbStatus || 'checking...'}`}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <Database className="w-3.5 h-3.5 opacity-70" />
            <span className="capitalize">{isConnected ? 'Atlas Connected' : dbStatus || 'Connecting...'}</span>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh employees list"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
