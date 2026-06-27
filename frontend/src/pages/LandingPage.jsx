import React from 'react';
import { Sparkles, Users, BookOpen, MessageSquare, Flame, ArrowRight, CheckCircle, Code, Award } from 'lucide-react';
import { OpenToLearnBadge } from '../components/BadgesAndTags';
import { Link } from 'react-router-dom';
export const LandingPage = ({ onStartOnboarding, onLogin }) => {
    return (<div className="bg-[#FCF8FF] min-h-screen relative overflow-hidden font-sans">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-primary-indigo/10 blur-[120px] pointer-events-none"/>
      <div className="absolute top-[20%] right-[-50px] w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[140px] pointer-events-none"/>
      <div className="absolute bottom-[10%] left-[20%] w-80 h-80 rounded-full bg-primary-container/10 blur-[100px] pointer-events-none"/>

      {/* Floating Header (Unauthenticated version for landing page) */}
      <header className="px-6 py-4 border-b border-outline-custom/10 bg-white/40 backdrop-blur-md relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="gradient-cta p-2.5 rounded-2xl shadow-lg shadow-primary-indigo/15">
              <Sparkles className="w-5 h-5 text-white"/>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-text-primary font-display flex items-center gap-1">
                SAHYOG
              </span>
              <p className="text-[10px] text-text-secondary font-medium tracking-wide">Learn Together. Build Together.</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
            <a href="#features" className="hover:text-primary-indigo transition-colors">Features</a>
            <a href="#skillexchange" className="hover:text-primary-indigo transition-colors">Skill Exchange</a>
            <a href="#teamfinder" className="hover:text-primary-indigo transition-colors">Team Finder</a>
            <a href="#howitworks" className="hover:text-primary-indigo transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="px-5 py-2.5 rounded-full text-sm font-bold text-text-primary hover:bg-white/60 hover:text-primary-indigo border border-outline-custom/30 transition-all">
              Sign In
            </button>
            <button onClick={onStartOnboarding} className="gradient-cta text-white px-5.5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-indigo/25 hover:scale-[1.03] transition-transform flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-indigo/5 rounded-full border border-primary-indigo/10 animate-fade-in">
            <Flame className="w-4.5 h-4.5 text-primary-indigo animate-bounce"/>
            <span className="text-xs font-bold text-primary-indigo uppercase tracking-wider">The Academic Synergy Platform</span>
          </div>

          <h1 className="text-5xl lg:text-6.5xl font-black text-text-primary tracking-tight font-display leading-[1.05]">
            Learn Together.<br />
            <span className="text-gradient">Build Together.</span>
          </h1>

          <p className="text-text-secondary text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
            The decentralized peer-to-peer collaboration hub where students trade development skills, join competitive hackathon squads, co-author research, and form vibrant study groups.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <button onClick={onStartOnboarding} className="w-full sm:w-auto gradient-cta text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-primary-indigo/30 hover:shadow-primary-indigo/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 group">
              <span>Claim Your Academic Hub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button onClick={onLogin} className="w-full sm:w-auto px-8 py-4 bg-white rounded-full text-base font-bold text-text-primary border border-outline-custom/40 shadow-card hover:bg-slate-50 transition-colors">
              Explore Live Matches
            </button>
          </div>

          {/* Social Proof Stats badge */}
          {/* <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-custom"/>
              <span className="text-sm font-semibold">12,000+ Active Students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-custom"/>
              <span className="text-sm font-semibold">450+ Hackathons Synced</span>
            </div>
          </div> */}
        </div>

        {/* 3D Flat Illustration Container */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-outline-custom/25 relative animate-float">
            
            {/* Header element */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-custom/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"/>
                <div className="w-3 h-3 bg-amber-400 rounded-full"/>
                <div className="w-3 h-3 bg-green-400 rounded-full"/>
              </div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest bg-sahyog-bg px-2.5 py-1 rounded-full">
                Live Synergy Matrix
              </span>
            </div>

            {/* Illustration content (Visual Mockup of Skill Exchanging) */}
            <div className="space-y-4">
              <div className="bg-primary-indigo/5 p-4 rounded-2xl border border-primary-indigo/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-primary-indigo font-bold text-sm">
                    T
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-text-primary">Tejaswini Bakka</h4>
                    <p className="text-[10px] text-text-secondary">Stanford • Can Teach: <b className="text-primary-indigo">React</b></p>
                  </div>
                </div>
                <div className="bg-success-custom/10 text-success-custom text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success-custom rounded-full animate-ping"/>
                  ONLINE
                </div>
              </div>

              {/* Dynamic matching indicators */}
              <div className="flex justify-center my-2">
                <div className="py-1 px-3 bg-indigo-50 rounded-full border border-primary-indigo/15 text-[10px] text-primary-indigo font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-indigo animate-spin"/>
                  <span>94% Skills Matched</span>
                </div>
              </div>

              <div className="bg-cyan-50/40 p-4 rounded-2xl border border-cyan-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-200 flex items-center justify-center text-secondary-cyan font-bold text-sm">
                    C
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-text-primary">Chloe Chen</h4>
                    <p className="text-[10px] text-text-secondary">Berkeley • Wants: <b className="text-secondary-cyan">React</b></p>
                  </div>
                </div>
                <span className="text-[10px] bg-cyan-100 text-secondary-cyan px-2.5 py-1 rounded-full font-bold">RESEARCHER</span>
              </div>

              <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/10 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800">Learn Smart Contracts & ML</span>
                <OpenToLearnBadge />
              </div>
            </div>
          </div>

          {/* Floating tags */}
          <div className="absolute top-4 left-[-10px] bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-outline-custom/20 text-xs font-bold text-text-primary flex items-center gap-2 rotate-[-5deg]">
            <Code className="w-4 h-4 text-primary-indigo"/>
            <span>Figma → Rust</span>
          </div>

          <div className="absolute bottom-6 right-[-20px] bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-outline-custom/20 text-xs font-bold text-text-primary flex items-center gap-2 rotate-[6deg]">
            <Award className="w-4 h-4 text-amber-500 animate-bounce"/>
            <span>Hackathon squads</span>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES / STATISTICS SECTION */}
      <section className="bg-white py-20 border-t border-b border-outline-custom/10 relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black text-primary-indigo uppercase tracking-widest bg-primary-indigo/5 px-3.5 py-1.5 rounded-full">
              Full Spectrum Collaboration
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-display">
              Three Modules. One Unified Workspace.
            </h2>
            <p className="text-text-secondary text-base">
              Say goodbye to disconnected Discord servers, unorganized spreadsheets, and outdated Facebook groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Capability 1: Skill Exchange */}
            <Link to='/register'>
            <div className="p-8 rounded-3xl bg-sahyog-bg border border-outline-custom/20 shadow-sm hover:shadow-lg hover:border-primary-indigo/30 transition-all group" id="skillexchange">
              <div className="w-12 h-12 rounded-2xl bg-primary-indigo/10 flex items-center justify-center text-primary-indigo mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">1:1 Skill Exchanging</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                List the tools you can teach (e.g. Figma, C++) and things you want to learn (e.g. Solidity, Python). Our match engine pairs you with compatible student partners immediately.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-primary-indigo">
                <span>Explore match percentage metrics</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </div>
            </Link>

            {/* Capability 2: Hackathon Squad Builder */}
            <Link to='/register'>


            <div className="p-8 rounded-3xl bg-sahyog-bg border border-outline-custom/20 shadow-sm hover:shadow-lg hover:border-primary-indigo/30 transition-all group" id="teamfinder">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-secondary-cyan mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Hackathon Finder</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Discover collegiate hackathons, browse active team profiles looking for designers or engineers, publish open positions, and apply to join with automated skill overlap audits.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-secondary-cyan">
                <span>Filter by theme & dates</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </div>
            </Link>

            {/* Capability 3: Real-Time Messaging */}
            <Link to='/register'>

            <div className="p-8 rounded-3xl bg-sahyog-bg border border-outline-custom/20 shadow-sm hover:shadow-lg hover:border-primary-indigo/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6"/>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Real-Time Messaging</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Skip the hassle of moving to external apps. Connect instantly with your skill matches or hackathon invites through a built-in, real-time chat interface.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>Connect and chat instantly →</span>
              </div>
            </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10" id="howitworks">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black text-secondary-cyan uppercase tracking-widest bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-100">
            Frictionless onboarding
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-display">
            How Sahyog Sparks Collaborative Learning
          </h2>
          <p className="text-text-secondary text-sm">
            Three simple phases that transition you from isolated coder to collaborative builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting dashed line for step-guided feel on desktop */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-dashed border-t-2 border-dashed border-outline-custom/40 z-0"/>

          {[
            {
                step: '01',
                title: 'Build Onboarding Blueprint',
                desc: 'Select your university, add tags of what you do best, select areas you want to learn, and toggle the "Open To Learn Anything" status.',
                icon: '📋'
            },
            {
                step: '02',
                title: 'Discover Overlaps & Teams',
                desc: 'Our matrix searches for students whose teaching targets fit your learning needs, showing match score percentages and direct overlapping skills.',
                icon: '⚡'
            },
            {
                step: '03',
                title: 'Co-Author & Build',
                desc: 'Initiate direct messages, apply for hackathon squads, and collaborate instantly with your peers through real-time chat.',
                icon: '🚀'
            }
        ].map((item, idx) => (<div key={idx} className="bg-white p-8 rounded-3xl border border-outline-custom/25 shadow-card hover:translate-y-[-4px] transition-transform relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-primary-indigo/10 font-mono">{item.step}</span>
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>))}
        </div>
      </section>

      {/* 4. STATISTICS WRAPPER */}
      {/* <section className="bg-primary-indigo text-white py-16 px-6 relative z-10 rounded-[48px] max-w-7xl mx-auto shadow-2xl shadow-indigo-900/10 overflow-hidden mb-24">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent-cyan/15 blur-[120px]"/>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-[80px]"/>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-4xl lg:text-5xl font-black font-display text-accent-cyan">94%</h4>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase mt-2">Team Formation Rate</p>
          </div>
          <div>
            <h4 className="text-4xl lg:text-5xl font-black font-display text-accent-cyan">18k+</h4>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase mt-2">Skill Connections</p>
          </div>
          <div>
            <h4 className="text-4xl lg:text-5xl font-black font-display text-accent-cyan">30+</h4>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase mt-2">Colleges Synced</p>
          </div>
          <div>
            <h4 className="text-4xl lg:text-5xl font-black font-display text-accent-cyan">120%</h4>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase mt-2">Learning Speed Increase</p>
          </div>
        </div>
      </section> */}

      {/* 5. TESTIMONIALS */}
      {/* <section className="py-20 bg-white border-t border-outline-custom/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-display">
              Real Impact, Student Approved
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
            {
                quote: "I listed Rust on Sahyog and got matched with Chloe from Berkeley within 10 minutes. She taught me Three.js shaders and I guided her through blockchain contract structures. We ended up building an AI NFT generator that won 2nd place at TreeHacks!",
                student: "Aarav Sharma",
                college: "IIT Bombay Sophomore"
            },
            {
                quote: "Finding hackathon squads was always a headache. Group chats were noisy and disorganized. On Sahyog, I filtered by 'required skills' for TreeHacks, found SustainAI, submitted my skill overlaps, and joined the team instantly. It streamlined our setup process.",
                student: "Elena Rostova",
                college: "University of Oxford"
            }
        ].map((t, idx) => (<div key={idx} className="p-8 rounded-3xl bg-sahyog-bg border border-outline-custom/20 space-y-6 shadow-sm">
                <p className="text-text-primary text-sm font-medium italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-indigo/15 text-primary-indigo font-black flex items-center justify-center text-xs">
                    {t.student.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-text-primary">{t.student}</h5>
                    <p className="text-[10px] text-text-secondary">{t.college}</p>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section> */}

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto relative z-10 space-y-8">
        <h2 className="text-4xl lg:text-5.5xl font-black text-text-primary font-display tracking-tight leading-[1.1]">
          Stop Learning Alone.<br />
          <span className="text-gradient">Build Together.</span>
        </h2>
        <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto font-medium">
          Claim your student workspace, exchange coding expertise, discover matching teammate portfolios, and lock down your next hackathon project squads.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={onStartOnboarding} className="w-full sm:w-auto gradient-cta text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-primary-indigo/25 hover:scale-[1.02] transition-transform">
            Start Onboarding Now
          </button>
          <button onClick={onLogin} className="w-full sm:w-auto px-8 py-4 bg-white text-text-primary font-bold border border-outline-custom/30 rounded-full hover:bg-slate-50 transition-colors shadow-card">
            Sign In to Hub
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-outline-custom/10 py-12 px-6 bg-white relative z-10 text-center text-text-secondary text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="gradient-cta p-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-white"/>
            </div>
            <span className="font-black text-text-primary font-display">SAHYOG</span>
          </div>
          <p className="font-semibold text-[11px]">&copy; 2026 Sahyog Peer Network. Created for Student Hackathons & Academics.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary-indigo cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary-indigo cursor-pointer transition-colors">GitHub Repository</span>
          </div>
        </div>
      </footer>
    </div>);
};
