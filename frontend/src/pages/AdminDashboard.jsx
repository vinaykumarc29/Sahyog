import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Award,
  LogOut,
  Menu,
  X
} from 'lucide-react';

// Import our subcomponents
import DashboardOverview from '../admin/DashboardOverview.jsx';
import UserManagement from '../admin/UserManagement.jsx';
import TeamManagement from '../admin/TeamManagement.jsx';
import SkillManagement from '../admin/SkillManagement.jsx';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminEmail = user?.email || 'admin@sahyog.edu';
  const adminName = user?.name || 'Tejaswini Bakka';

  // States to trigger metrics refresh
  const [kpiRefreshKey, setKpiRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateKPIs = () => {
    setKpiRefreshKey(prev => prev + 1);
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Teams', icon: Layers },
    { name: 'Skills', icon: Award },
  ];

  return (
    <div className="h-screen bg-slate-50/50 flex text-slate-800 overflow-hidden relative" id="sahyog-admin-root">

      {/* 1. Persistant left sidebar - fully fixed on desktop and mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Brand area */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">

             <div onClick={() => setActiveTab('Dashboard')} className="flex items-center gap-2.5 cursor-pointer select-none group" id="nav-logo">
          {/* Replaced the Sparkles div with your new image */}
          <img
            src="/logo.jpeg"
            alt="Sahyog Icon"
            className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
          />

          {/* Updated text to match the new image branding */}
          <div>
            <span className="text-base md:text-xl font-extrabold tracking-tight text-text-primary font-display flex items-center gap-1">
              SAHYOG
              {/* <span className="text-[10px] uppercase font-bold tracking-widest bg-primary-indigo/5 text-primary-indigo px-1.5 py-0.5 rounded-md border border-primary-indigo/10">v1.0</span> */}
            </span>
            <p className="text-[10px] text-text-secondary font-medium tracking-wide">SKILL SHARE. GROW TOGETHER.</p>
          </div>
        </div>









            {/* <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-heading font-black text-white text-base shadow-md shadow-indigo-100/50">
                S
              </div>
              <div>
                <span className="font-heading font-extrabold text-slate-800 tracking-tight text-base block">Sahyog Admin</span>
                <span className="text-[10px] text-indigo-500 font-bold tracking-wider uppercase">Portal Console</span>
              </div>
            </div> */}

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    // Close sidebar on mobile
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeSideBarMarker"
                      className="w-1 h-5 bg-indigo-600 rounded-full absolute left-0 top-1/2 -translate-y-1/2"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Account section */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/40">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase border border-white shadow-sm shrink-0">
                {adminEmail ? adminEmail.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {adminName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">{adminEmail}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-slate-200/50 text-slate-500 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden md:pl-64">

        {/* Top Navbar header */}
        <header className="bg-white border-b border-slate-100 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Clock, indicators */}
          <div className="flex items-center gap-4">
            {/* Live UTC indicator */}
            {/* <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[10px] font-mono font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
                  <span>{timeStr || 'Loading...'}</span>
                </div> */}

            {/* Platform live telemetry indicators */}
            {/* <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-full text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>NODE LIVE</span>
                </div> */}
          </div>
        </header>

        {/* Scrollable primary window area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + kpiRefreshKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'Dashboard' && (
                <DashboardOverview
                  key={kpiRefreshKey}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onViewUserProfile={() => {
                    setActiveTab('Users');
                  }}
                />
              )}
              {activeTab === 'Users' && <UserManagement onUpdateKPIs={handleUpdateKPIs} />}
              {activeTab === 'Teams' && <TeamManagement />}
              {activeTab === 'Skills' && <SkillManagement />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;