import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Check, Code2, Globe, GraduationCap, ArrowRight } from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = ({ onLoginSuccess, onNavigateToRegister, onBackToLanding }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const goToRegister = onNavigateToRegister || (() => navigate('/register'));
    const goToLanding = onBackToLanding || (() => navigate('/'));
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const res = await api.post('/api/auth/login', { email, password });
            login(res.data.token, res.data.user);
            onLoginSuccess?.(res.data.user);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Could not sign in. Please check your credentials.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const fillQuickAcc = (type) => {
        if (type === 'tejaswini') {
            setEmail('tejaswinibakka2115@gmail.com');
            setPassword('password123');
        }
        else {
            setEmail('aarav@iitb.ac.in');
            setPassword('password123');
        }
    };
    return (<div className="min-h-screen w-full bg-[#FCF8FF] relative flex flex-col justify-center items-center p-6 overflow-hidden font-sans">
      
      {/* Absolute Decorative Blur Elements */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 rounded-full bg-primary-indigo/10 blur-[100px] pointer-events-none"/>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-accent-cyan/10 blur-[120px] pointer-events-none"/>

      {/* Floating Logo Shortcut */}
      <div onClick={goToLanding} className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer group z-20">
        <div className="gradient-cta p-2 rounded-xl group-hover:scale-105 transition-all">
          <Sparkles className="w-4.5 h-4.5 text-white"/>
        </div>
        <span className="font-bold text-sm text-text-primary font-display tracking-tight">SAHYOG</span>
      </div>

      {/* Modern glass card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[32px] border border-white p-8 lg:p-10 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary-indigo/5 rounded-2xl text-primary-indigo mb-4">
            <GraduationCap className="w-8 h-8"/>
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight font-display">Welcome Back</h2>
          <p className="text-text-secondary text-xs mt-1 font-medium">Log in to reconnect with your study partners</p>
        </div>

        {error && (<div className="p-3.5 mb-5 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100 animate-fade-in">
            {error}
          </div>)}

        {infoMessage && (<div className="p-3.5 mb-5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-2xl border border-emerald-100 animate-fade-in flex items-start gap-2">
            <span>✉️</span>
            <span>{infoMessage}</span>
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary tracking-wide uppercase px-1">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary"/>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className="w-full pl-12 pr-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo/30 focus:border-primary-indigo text-xs text-text-primary placeholder:text-text-secondary/50 transition-all"/>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-text-secondary tracking-wide uppercase">Password</label>
              <button type="button" onClick={() => setInfoMessage("Mock password recovery trigger has been sent to your college mail inbox.")} className="text-[10px] font-bold text-primary-indigo hover:underline">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary"/>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-12 pr-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo/30 focus:border-primary-indigo text-xs text-text-primary placeholder:text-text-secondary/50 transition-all"/>
            </div>
          </div>

          {/* Remember me toggle */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div onClick={() => setRememberMe(!rememberMe)} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-primary-indigo border-primary-indigo text-white' : 'border-outline-custom bg-white'}`}>
                {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]"/>}
              </div>
              <span className="text-xs font-semibold text-text-secondary">Keep me signed in</span>
            </label>
          </div>

          {/* Sign In CTA */}
          <button type="submit" disabled={submitting} className="w-full py-4 gradient-cta text-white rounded-full text-xs font-bold shadow-xl shadow-primary-indigo/25 hover:shadow-primary-indigo/35 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
            <span>{submitting ? 'Signing In...' : 'Sign In to Sahyog Hub'}</span>
            <ArrowRight className="w-4 h-4"/>
          </button>
        </form>

        {/* Divider */}
        {/* <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-custom/20"></div></div>
          <span className="relative px-3 bg-white text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">Demo Quick Access</span>
        </div> */}

        {/* Quick Access helper buttons */}
        {/* <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => fillQuickAcc('tejaswini')} className="py-2 px-3.5 bg-primary-indigo/5 hover:bg-primary-indigo/10 text-primary-indigo text-[10px] font-bold rounded-xl transition-all border border-primary-indigo/10 truncate">
            Tejaswini (Stanford)
          </button>
          <button onClick={() => fillQuickAcc('aarav')} className="py-2 px-3.5 bg-cyan-50 hover:bg-cyan-100 text-secondary-cyan text-[10px] font-bold rounded-xl transition-all border border-cyan-100 truncate">
            Aarav (IIT Bombay)
          </button>
        </div> */}

        {/* Alternative Social Sign In */}
        {/* <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setInfoMessage('GitHub auth is not configured yet. Use email/password for now.')} className="flex items-center justify-center gap-2 py-3 border border-outline-custom/30 rounded-full hover:bg-slate-50 transition-colors text-xs font-bold text-text-primary">
            <Code2 className="w-4 h-4"/>
            <span>GitHub</span>
          </button>
          <button onClick={() => setInfoMessage('Google auth is not configured yet. Use email/password for now.')} className="flex items-center justify-center gap-2 py-3 border border-outline-custom/30 rounded-full hover:bg-slate-50 transition-colors text-xs font-bold text-text-primary">
            <Globe className="w-4 h-4 text-primary-indigo"/>
            <span>Google</span>
          </button>
        </div> */}

        {/* Navigate to Registration */}
        <div className="text-center mt-6">
          <p className="text-xs text-text-secondary font-semibold">
            Don't have an academic account?{' '}
            <button onClick={goToRegister} className="text-primary-indigo hover:underline font-bold">
              Start Onboarding
            </button>
          </p>
        </div>

      </div>
    </div>);
};
export default LoginPage;
