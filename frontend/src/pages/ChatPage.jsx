import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';
import { useWorkspace } from '../context/WorkspaceContext.jsx';

export const ChatPage = () => {
    const { currentUser, users: allUsers } = useWorkspace();
    const [activePartnerId, setActivePartnerId] = useState('');
    const [typedMessage, setTypedMessage] = useState('');
    const [searchSidebarQuery, setSearchSidebarQuery] = useState('');
    const [showMobileList, setShowMobileList] = useState(true);
    const messageEndRef = useRef(null);

    // Filter connections who can be chatted with
    const connectedUsers = (allUsers || []).filter(u =>
        u.id !== currentUser.id && (currentUser.connections || []).includes(u.id)
    );
    const connectionsForChat = connectedUsers.length > 0
        ? connectedUsers
        : (allUsers || []).filter(u => u.id !== currentUser.id).slice(0, 4);

    const filteredChatPartners = connectionsForChat.filter(u =>
        u.name.toLowerCase().includes(searchSidebarQuery.toLowerCase()) ||
        (u.college || '').toLowerCase().includes(searchSidebarQuery.toLowerCase())
    );

    // Set default partner
    useEffect(() => {
        if (!activePartnerId && connectionsForChat[0]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActivePartnerId(connectionsForChat[0].id);
        }
    }, [activePartnerId, connectionsForChat]);

    const activePartner = (allUsers || []).find(u => u.id === activePartnerId) || connectionsForChat[0];

    // Real-time chat using useChat hook
    const { messages, loading: messagesLoading, sendMessage } = useChat(
        currentUser.id,
        activePartner?.id
    );

    // Filter messages for this conversation
    const conversation = messages.filter(m =>
        (m.senderId === currentUser.id && m.receiverId === activePartner?.id) ||
        (m.senderId === activePartner?.id && m.receiverId === currentUser.id)
    );

    // Send message handler
    const handleSend = async (e) => {
        e.preventDefault();
        if (!typedMessage.trim() || !activePartner) return;
        try {
            await sendMessage(activePartner.id, typedMessage.trim());
            setTypedMessage('');
        } catch {
            // ignore — useChat handles errors internally
        }
    };

    // Scroll to bottom on new messages
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.length, activePartnerId]);

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 font-sans pb-24 lg:pb-8">

            <div className="bg-white rounded-[32px] border border-outline-custom/30 shadow-card overflow-hidden h-[580px] grid grid-cols-1 md:grid-cols-12 relative">

                {/* Sidebar - Added min-h-0 here */}
                <div className={`md:col-span-4 border-r border-outline-custom/15 flex flex-col h-full bg-slate-50/50 min-h-0 ${showMobileList ? 'block' : 'hidden md:flex'}`}>

                    <div className="p-4 border-b border-outline-custom/15 bg-white space-y-3 shrink-0">
                        <h3 className="text-sm font-black text-text-primary tracking-wide flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary-indigo" />
                            <span>Campus Co-conspirators</span>
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search study buddies..."
                                value={searchSidebarQuery}
                                onChange={(e) => setSearchSidebarQuery(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredChatPartners.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                                <span className="text-2xl">🔗</span>
                                <p className="text-xs font-bold text-text-primary">No connections yet</p>
                                <p className="text-[11px] text-text-secondary/80">Connect with peers on the Matches page first.</p>
                            </div>
                        ) : (
                            filteredChatPartners.map(user => {
                                const isActive = user.id === activePartner?.id;
                                const hasUnread = messages.some(m => m.senderId === user.id);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => { setActivePartnerId(user.id); setShowMobileList(false); }}
                                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${isActive
                                            ? 'bg-primary-indigo text-white shadow-md shadow-primary-indigo/15'
                                            : 'hover:bg-sahyog-bg text-text-primary'}`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-custom border-2 border-white rounded-full" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>
                                                    {user.name}
                                                </p>
                                                <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-text-secondary'}`}>
                                                    {user.college}
                                                </p>
                                            </div>
                                        </div>
                                        {hasUnread && !isActive && <span className="w-2.5 h-2.5 bg-primary-indigo rounded-full shrink-0" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Conversation Panel - Added min-h-0 here */}
                <div className={`md:col-span-8 flex flex-col h-full bg-white relative min-h-0 ${!showMobileList ? 'block' : 'hidden md:flex'}`}>

                    {activePartner ? (
                        <>
                            {/* Thread Header */}
                            <div className="p-4 border-b border-outline-custom/15 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button onClick={() => setShowMobileList(true)} className="md:hidden p-1.5 rounded-full hover:bg-sahyog-bg text-text-secondary">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <img src={activePartner.avatar} alt={activePartner.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-black text-text-primary truncate">{activePartner.name}</h4>
                                        <p className="text-[10px] text-text-secondary truncate">{activePartner.college}</p>
                                    </div>
                                </div>
                                <div className="text-[10px] bg-emerald-50 text-success-custom font-bold px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                                    Active Sync
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-sahyog-bg/20">
                                {messagesLoading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-primary-indigo animate-spin" />
                                    </div>
                                ) : conversation.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                                        <span className="text-2xl">🌱</span>
                                        <h5 className="text-xs font-bold text-text-primary">Seed of Synergy</h5>
                                        <p className="text-[11px] text-text-secondary/80 max-w-xs">Ask {activePartner.name} about their expertise or proposed study times to begin your collaboration.</p>
                                    </div>
                                ) : (
                                    conversation.map(msg => {
                                        const isSelf = msg.senderId === currentUser.id;
                                        return (
                                            <div key={msg.id || msg.timestamp} className={`flex gap-3 max-w-[80%] ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                                                {!isSelf && <img src={activePartner.avatar} alt={activePartner.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />}
                                                <div className="space-y-1">
                                                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${isSelf
                                                        ? 'bg-primary-indigo text-white rounded-tr-none'
                                                        : 'bg-white text-text-primary rounded-tl-none border border-outline-custom/15'}`}>
                                                        <p>{msg.message}</p>
                                                    </div>
                                                    <span className={`text-[9px] text-text-secondary/60 block ${isSelf ? 'text-right' : 'text-left'}`}>
                                                        {msg.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messageEndRef} />
                            </div>

                            {/* Composer */}
                            <form onSubmit={handleSend} className="p-4 border-t border-outline-custom/15 bg-white shrink-0 flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Write secure sync signal to ${activePartner.name.split(' ')[0]}...`}
                                    value={typedMessage}
                                    onChange={(e) => setTypedMessage(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-sahyog-bg rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
                                />
                                <button type="submit" className="p-3 gradient-cta text-white rounded-2xl hover:scale-105 transition-transform">
                                    <Send className="w-4 h-4 stroke-[3]" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                            <span className="text-3xl">💬</span>
                            <h5 className="text-sm font-bold text-text-primary">No Active Thread Selected</h5>
                            <p className="text-xs text-text-secondary max-w-xs">Select a study buddy on the sidebar pane to display secure chat logs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};