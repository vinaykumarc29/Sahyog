import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import api from '../api/axios.js';
import { Bell, UserPlus, FileCheck, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const NotificationsPage = () => {
    const { currentUser, users: allUsers, reloadWorkspace } = useWorkspace();
    const navigate = useNavigate();
    const onAcceptConnection = async (senderId) => { await api.put(`/api/users/connect/${senderId}/accept`); await reloadWorkspace(); };
    const onRejectConnection = async (senderId) => { await api.put(`/api/users/connect/${senderId}/reject`); await reloadWorkspace(); };
    const notifications = (currentUser?.pendingRequests || []).map(reqId => {
    const sender = allUsers.find(u => u.id === String(reqId)); // add String()
    return {
        id: `conn-${reqId}`,
        type: 'connection_request',
        title: 'Connection Request',
        message: sender ? `${sender.name} wants to connect with you` : 'Someone wants to connect with you',
        senderId: String(reqId), // add String()
        isRead: false,
        timestamp: 'Recently',
    };
});
    const onMarkAllAsRead = () => {};
    const onClearAll = () => {};
    const setActiveTab = () => {};
    const getIconForType = (type) => {
        switch (type) {
            case 'connection_request':
                return <UserPlus className="w-4.5 h-4.5 text-primary-indigo"/>;
            case 'application_approved':
                return <FileCheck className="w-4.5 h-4.5 text-success-custom"/>;
            case 'chat_message':
                return <MessageSquare className="w-4.5 h-4.5 text-cyan-600"/>;
            default:
                return <Bell className="w-4.5 h-4.5 text-amber-500"/>;
        }
    };
    return (<div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-custom/15 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary font-display flex items-center gap-2">
            <Bell className="text-primary-indigo w-6 h-6 animate-swing"/>
            <span>Secure Notification Center</span>
          </h1>
          <p className="text-text-secondary text-xs mt-0.5 font-medium">Verify credentials, review team invite logs, and monitor connection status updates</p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button onClick={onMarkAllAsRead} className="px-4 py-2 bg-sahyog-bg hover:bg-slate-100 border border-outline-custom/20 text-[10px] font-black tracking-wide uppercase rounded-xl transition-all">
            Mark all read
          </button>
          <button onClick={onClearAll} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black tracking-wide uppercase rounded-xl transition-all">
            Clear logs
          </button>
        </div>
      </div>

      {/* Main Notification Stream list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (<div className="bg-white p-16 rounded-[32px] border border-outline-custom/25 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mx-auto text-xl">
              📭
            </div>
            <h3 className="text-xs font-bold text-text-primary">Your Inbox is Pruned</h3>
            <p className="text-[11px] text-text-secondary max-w-xs mx-auto">There are no unread system telemetry files or connection requests at this hour.</p>
          </div>) : (notifications.map((notif) => {
            const senderModel = notif.senderId ? allUsers.find(u => u.id === notif.senderId) : null;
            return (<div key={notif.id} className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${notif.isRead
                    ? 'bg-white border-outline-custom/15 shadow-sm'
                    : 'bg-[#FCF8FF] border-primary-indigo/20 shadow-md ring-1 ring-primary-indigo/5'}`}>
                <div className="flex gap-4.5 items-start">
                  
                  {/* Category icon */}
                  <div className={`p-3 rounded-2xl shrink-0 ${notif.isRead ? 'bg-slate-100' : 'bg-primary-indigo/5'}`}>
                    {getIconForType(notif.type)}
                  </div>

                  {/* Body text details */}
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-text-primary flex items-center gap-2">
                      <span>{notif.title}</span>
                      {!notif.isRead && (<span className="w-2 h-2 bg-primary-indigo rounded-full shrink-0"/>)}
                    </p>
                    <p className="text-xs text-text-secondary leading-snug">{notif.message}</p>
                    <span className="text-[10px] text-text-secondary/60 block mt-1">{notif.timestamp}</span>
                  </div>

                </div>

                {/* Sub Action indicators for special request cards */}
                {notif.type === 'connection_request' && notif.senderId && (<div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button onClick={() => onRejectConnection(notif.senderId)} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black tracking-wide transition-colors">
                      Decline
                    </button>
                    <button onClick={() => onAcceptConnection(notif.senderId)} className="px-4 py-1.5 bg-primary-indigo hover:bg-indigo-600 text-white rounded-lg text-[10px] font-black tracking-wide transition-colors">
                      Accept
                    </button>
                  </div>)}

                {/* Direct quick navs */}
                {notif.type === 'chat_message' && (<button onClick={() => navigate('/chat')} className="px-4 py-1.5 bg-primary-indigo/5 hover:bg-primary-indigo/10 text-primary-indigo rounded-lg text-[10px] font-black tracking-wide transition-colors shrink-0">
                    Reply
                  </button>)}

                {notif.type === 'application_approved' && notif.teamId && (<button onClick={() => navigate(`/teams/${notif.teamId}`)} className="px-4 py-1.5 bg-success-custom/5 hover:bg-success-custom/10 text-success-custom rounded-lg text-[10px] font-black tracking-wide transition-colors shrink-0">
                    Enter Squad
                  </button>)}

              </div>);
        }))}
      </div>

    </div>);
};
