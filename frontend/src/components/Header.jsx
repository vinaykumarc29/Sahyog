import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, Compass, Users, Sparkles, LogOut, Settings, User as UserIcon, Menu, X, ArrowUpRight } from 'lucide-react';
import { TRENDING_SKILLS } from '../data';
import { OpenToLearnBadge } from './BadgesAndTags';

export const Header = ({ currentUser, allUsers, allTeams, notifications = [], markNotificationsAsRead, onLogout, onSearchSubmit }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle outside clicks to close dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter autocomplete options based on searchQuery
    const getAutocompleteResults = () => {
        if (!searchQuery)
            return { skills: TRENDING_SKILLS.slice(0, 4), users: (allUsers || []).slice(0, 2), teams: (allTeams || []).slice(0, 2) };
        const query = searchQuery.toLowerCase();
        const matchedSkills = TRENDING_SKILLS.filter(s => s.toLowerCase().includes(query)).slice(0, 3);
        const matchedUsers = (allUsers || []).filter(u =>
            u.name.toLowerCase().includes(query) ||
            (u.college || '').toLowerCase().includes(query) ||
            (u.skillsToTeach || []).some(s => s.toLowerCase().includes(query))
        ).slice(0, 3);
        const matchedTeams = (allTeams || []).filter(t =>
            t.name.toLowerCase().includes(query) ||
            (t.hackathonName || '').toLowerCase().includes(query) ||
            (t.requiredSkills || []).some(s => s.toLowerCase().includes(query))
        ).slice(0, 3);
        return { skills: matchedSkills, users: matchedUsers, teams: matchedTeams };
    };
    const results = getAutocompleteResults();

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            if (onSearchSubmit) onSearchSubmit(searchQuery);
            else navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
        }
    };
    const handleSelectAutocomplete = (term) => {
        setSearchQuery(term);
        if (onSearchSubmit) onSearchSubmit(term);
        else navigate(`/search?q=${encodeURIComponent(term)}`);
        setIsSearchFocused(false);
    };

    const navTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Compass, path: '/dashboard' },
        { id: 'matches', label: 'Matches', icon: Sparkles, path: '/matches' },
        { id: 'teams', label: 'Teams', icon: Users, path: '/teams' },
        { id: 'chat', label: 'Messages', icon: MessageSquare, path: '/chat' },
    ];

    const isTabActive = (path) =>
        location.pathname === path ||
        (path === '/teams' && location.pathname.startsWith('/teams'));

    return (
        <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-outline-custom/20 shadow-sm px-4 lg:px-8 py-3.5 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Brand Logo */}

                <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5 cursor-pointer select-none group" id="nav-logo">
                    {/* Replaced the Sparkles div with your new image */}
                    <img
                        src="/logo.jpeg"
                        alt="Sahayog Icon"
                        className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
                    />

                    {/* Updated text to match the new image branding */}
                    <div>
                        <span className="text-xl font-extrabold tracking-tight text-text-primary font-display flex items-center gap-1">
                            SAHAYOG
                            {/* <span className="text-[10px] uppercase font-bold tracking-widest bg-primary-indigo/5 text-primary-indigo px-1.5 py-0.5 rounded-md border border-primary-indigo/10">v1.0</span> */}
                        </span>
                        <p className="text-[10px] text-text-secondary font-medium tracking-wide">SKILL SHARE. GROW TOGETHER.</p>
                    </div>
                </div>




                {/* <div onClick={() => navigate('/dashboard')} className="flex items-center cursor-pointer select-none group" id="nav-logo">
                    <img
                        src="/logo.png"
                        alt="Sahayog Logo"
                        className="h-16 w-auto group-hover:scale-105 transition-transform"
                    />
                </div> */}

                {/* Global Search Bar */}
                <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative" id="global-search-container">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search users, skills (e.g. React), or teams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onKeyDown={handleSearchKeyPress}
                            className="w-full pl-11 pr-4 py-2.5 bg-sahyog-bg rounded-full border border-outline-custom/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo/30 focus:border-primary-indigo text-sm text-text-primary placeholder:text-text-secondary/70 transition-all shadow-inner"
                        />
                    </div>

                    {/* Search Dropdown / Autocomplete */}
                    {isSearchFocused && (
                        <div className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-3xl border border-outline-custom/30 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {searchQuery && (
                                <div onClick={() => handleSelectAutocomplete(searchQuery)} className="flex items-center justify-between p-2.5 hover:bg-sahyog-bg rounded-xl cursor-pointer text-sm font-semibold text-primary-indigo">
                                    <span>Search for "{searchQuery}"</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            )}

                            {/* Trending / Matched Skills */}
                            <div className="mt-2.5">
                                <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">Trending Skills</h5>
                                <div className="flex flex-wrap gap-1.5">
                                    {results.skills.map(skill => (
                                        <button key={skill} onClick={() => handleSelectAutocomplete(skill)} className="px-3 py-1 bg-sahyog-bg hover:bg-primary-indigo/5 hover:text-primary-indigo text-xs font-semibold rounded-full border border-outline-custom/10 transition-colors">
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Matched Users */}
                            {results.users.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">Suggested Collaborators</h5>
                                    <div className="space-y-1.5">
                                        {results.users.map(u => (
                                            <div key={u.id} onClick={() => { navigate(`/profile/${u.id}`); setIsSearchFocused(false); }} className="flex items-center gap-3 p-2 hover:bg-sahyog-bg rounded-xl cursor-pointer transition-colors">
                                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                                        {u.name}
                                                        {u.isOpenToLearnAnything && <span className="w-2 h-2 bg-success-custom rounded-full animate-ping" />}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary truncate max-w-[250px]">{u.college}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Matched Teams */}
                            {results.teams.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">Hackathon Teams</h5>
                                    <div className="space-y-1.5">
                                        {results.teams.map(t => (
                                            <div key={t.id} onClick={() => { navigate(`/teams/${t.id}`); setIsSearchFocused(false); }} className="flex items-center justify-between p-2 hover:bg-sahyog-bg rounded-xl cursor-pointer transition-colors">
                                                <div>
                                                    <p className="text-xs font-bold text-text-primary">{t.name}</p>
                                                    <p className="text-[10px] text-text-secondary truncate max-w-[220px]">{t.hackathonName}</p>
                                                </div>
                                                <span className="text-[10px] bg-primary-indigo/10 text-primary-indigo px-2 py-0.5 rounded-full font-bold">
                                                    {(t.members || []).length}/{t.maxSize} Full
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Navigation Tabs */}
                <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-tabs">
                    {navTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = isTabActive(tab.path);
                        return (
                            <button
                                key={tab.id}
                                id={`nav-${tab.id}`}
                                onClick={() => navigate(tab.path)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${isActive
                                    ? 'bg-primary-indigo text-white shadow-md shadow-primary-indigo/15'
                                    : 'text-text-secondary hover:text-primary-indigo hover:bg-primary-indigo/5'}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Toolbar */}
                <div className="flex items-center gap-2.5" id="nav-toolbar">

                    {/* Notifications */}
                    <div ref={notificationRef} className="relative">
                        <button
                            onClick={() => { setIsNotificationOpen(!isNotificationOpen); if (markNotificationsAsRead) markNotificationsAsRead(); }}
                            id="notifications-bell-btn"
                            className="p-2.5 rounded-full hover:bg-primary-indigo/5 text-text-secondary hover:text-primary-indigo relative transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-error-custom text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-3.5 bg-white rounded-3xl border border-outline-custom/30 shadow-2xl w-80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-3 border-b border-outline-custom/15 pb-2">
                                    <h4 className="text-sm font-bold text-text-primary">Notifications Center</h4>
                                    <button onClick={() => { navigate('/notifications'); setIsNotificationOpen(false); }} className="text-[11px] font-bold text-primary-indigo hover:underline">
                                        View All
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="text-xs text-text-secondary text-center py-4">No notifications yet</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => {
                                                    if (n.type === 'connection_request') navigate('/matches');
                                                    else if (n.type === 'chat_message') navigate('/chat');
                                                    else if (n.teamId) navigate(`/teams/${n.teamId}`);
                                                    setIsNotificationOpen(false);
                                                }}
                                                className={`p-2.5 rounded-2xl text-xs cursor-pointer transition-all ${n.isRead ? 'bg-transparent hover:bg-sahyog-bg' : 'bg-primary-indigo/5 border border-primary-indigo/10'}`}
                                            >
                                                <p className="font-bold text-text-primary">{n.title}</p>
                                                <p className="text-text-secondary mt-0.5 leading-snug">{n.message}</p>
                                                <span className="text-[10px] text-text-secondary/60 mt-1 block">{n.timestamp}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            id="avatar-menu-btn"
                            className="flex items-center gap-2.5 p-1 rounded-full border border-outline-custom/20 hover:border-primary-indigo hover:bg-sahyog-bg transition-all"
                        >
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-primary-indigo/10" />
                            <span className="hidden sm:inline text-xs font-bold text-text-primary pr-2">{currentUser.name.split(' ')[0]}</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3.5 bg-white rounded-3xl border border-outline-custom/30 shadow-2xl w-56 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 py-2 border-b border-outline-custom/15 pb-3">
                                    <p className="text-xs font-bold text-text-primary">{currentUser.name}</p>
                                    <p className="text-[10px] text-text-secondary truncate mt-0.5">{currentUser.college}</p>
                                    {currentUser.isOpenToLearnAnything && (
                                        <div className="mt-1.5">
                                            <OpenToLearnBadge />
                                        </div>
                                    )}
                                </div>

                                <div className="py-2.5 space-y-1">
                                    <button
                                        onClick={() => { navigate(`/profile/${currentUser.id}`); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-sahyog-bg rounded-xl text-xs font-semibold text-text-primary transition-colors text-left"
                                    >
                                        <UserIcon className="w-4 h-4 text-text-secondary" />
                                        My Profile
                                    </button>

                                    <button
                                        onClick={() => { navigate('/profile/edit'); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-sahyog-bg rounded-xl text-xs font-semibold text-text-primary transition-colors text-left"
                                    >
                                        <Settings className="w-4 h-4 text-text-secondary" />
                                        Edit Profile
                                    </button>

                                    <button
                                        onClick={() => { if (onLogout) onLogout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4 text-red-500" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2.5 rounded-full hover:bg-primary-indigo/5 text-text-secondary lg:hidden transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-outline-custom/20 p-4 shadow-xl z-50 animate-in slide-in-from-top duration-200">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search user, skill, team..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyPress}
                            className="w-full px-4 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: Compass, path: '/dashboard' },
                            { id: 'matches', label: 'Matches', icon: Sparkles, path: '/matches' },
                            { id: 'teams', label: 'Teams', icon: Users, path: '/teams' },
                            { id: 'chat', label: 'Messages', icon: MessageSquare, path: '/chat' },
                            { id: 'profile', label: 'My Profile', icon: UserIcon, path: `/profile/${currentUser.id}` },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { navigate(tab.path); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${isTabActive(tab.path)
                                        ? 'bg-primary-indigo/10 text-primary-indigo'
                                        : 'text-text-secondary hover:bg-sahyog-bg'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};
