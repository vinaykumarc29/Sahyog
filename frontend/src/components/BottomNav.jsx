import React from 'react';
import { Compass, Sparkles, Users, MessageSquare } from 'lucide-react';
export const BottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Compass },
        { id: 'matches', label: 'Matches', icon: Sparkles },
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'chat', label: 'Chat', icon: MessageSquare }
    ];
    return (<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-outline-custom/15 py-2 px-4 z-40 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'teams' && activeTab.startsWith('team-'));
            return (<button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl transition-all">
            <div className={`p-1.5 rounded-full transition-all ${isActive
                    ? 'bg-primary-indigo text-white scale-110 shadow-md shadow-primary-indigo/20'
                    : 'text-text-secondary hover:text-primary-indigo'}`}>
              <Icon className="w-5 h-5"/>
            </div>
            <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-primary-indigo' : 'text-text-secondary/80'}`}>
              {item.label}
            </span>
          </button>);
        })}
    </div>);
};
