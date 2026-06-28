import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users, MessageSquare, Share2, Layers,
  TrendingUp, Clock, Sparkles
} from 'lucide-react';
import { getStatsApi } from '../api/adminApi.js';

export default function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState({
    totalUsers: 0, totalTeams: 0, totalConnections: 0,
    messagesToday: 0, activeTeams: 0, suspendedUsers: 0,
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatsApi()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderSparkline = (data, strokeColor) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * 60;
      const y = 25 - ((val - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg className="w-16 h-8" viewBox="0 0 60 25">
        <polyline fill="none" stroke={strokeColor} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  const statCards = [
    { id: 'users', title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'indigo', sparkData: [20, 40, 60, 80, 100, 120, 140, stats.totalUsers], tab: 'Users' },
    { id: 'teams', title: 'Total Teams', value: stats.totalTeams, icon: Layers, color: 'sky', sparkData: [3, 8, 14, 19, 23, 28, 31, stats.totalTeams], tab: 'Teams' },
    { id: 'connections', title: 'Total Connections', value: stats.totalConnections, icon: Share2, color: 'cyan', sparkData: [10, 20, 40, 80, 100, 150, 200, stats.totalConnections], tab: 'Dashboard' },
    { id: 'messages', title: 'Messages Today', value: stats.messagesToday, icon: MessageSquare, color: 'emerald', sparkData: [5, 10, 20, 30, 40, 50, 60, stats.messagesToday], tab: 'Dashboard' },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100/50', stroke: '#6366f1' },
    sky: { bg: 'bg-sky-50 text-sky-600 border-sky-100/50', stroke: '#0284c7' },
    cyan: { bg: 'bg-cyan-50 text-cyan-600 border-cyan-100/50', stroke: '#06b6d4' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100/50', stroke: '#10b981' },
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-slate-400">
      Loading dashboard...
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Sahyog Control Center
            <span className="text-sm font-medium px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time analytics and moderation controls.</p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200/50 px-3 py-1.5 rounded-xl text-slate-700">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-slate-500">Connections:</span>
              <span className="font-mono font-bold text-cyan-700">{stats.totalConnections}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200/50 px-3 py-1.5 rounded-xl text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500">Messages Today:</span>
              <span className="font-mono font-bold text-emerald-700">{stats.messagesToday}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200/50 px-3 py-1.5 rounded-xl text-slate-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-500">Suspended:</span>
              <span className="font-mono font-bold text-red-700">{stats.suspendedUsers}</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl self-start md:self-center flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const { bg, stroke } = colorMap[card.color];
          return (
            <motion.div key={card.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onNavigate(card.tab)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all duration-300" />
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">{card.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl border ${bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <span className="text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md text-xs font-medium">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> Live
                </span>
                {renderSparkline(card.sparkData, stroke)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* User Growth Chart */}
      {stats.userGrowth.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-lg mb-4">User Growth (Last 12 Months)</h3>
          <div className="flex items-end gap-2 h-32">
            {stats.userGrowth.map((m, i) => {
              const max = Math.max(...stats.userGrowth.map(x => x.count)) || 1;
              const height = (m.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-mono">{m.count}</span>
                  <div className="w-full bg-indigo-500 rounded-t-md transition-all"
                    style={{ height: `${height}%`, minHeight: m.count > 0 ? '4px' : '0' }} />
                  <span className="text-[10px] text-slate-400">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Teams</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.activeTeams}</p>
          <p className="text-xs text-slate-400 mt-1">Currently open for applications</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Suspended Accounts</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.suspendedUsers}</p>
          <p className="text-xs text-slate-400 mt-1">Users blocked from platform</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Messages</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalMessages || 0}</p>
          <p className="text-xs text-slate-400 mt-1">All time messages sent</p>
        </div>
      </div>
    </div>
  );
}