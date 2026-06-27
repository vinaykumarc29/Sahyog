import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { Sparkles, Users, ArrowLeft, Check, Calendar } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
// Comprehensive list of skills for the dropdowns
const ALL_SKILLS = [
  'AWS', 'C++', 'Data Science', 'Docker', 'Figma', 'Go', 'Java', 'JavaScript', 
  'Machine Learning', 'Next.js', 'Node.js', 'Python', 'PyTorch', 'React', 'Rust', 
  'Solidity', 'Tailwind CSS', 'TypeScript', 'UI/UX', 'Web3'
];

export const CreateTeamPage = () => {
    const navigate = useNavigate();
    const { reloadWorkspace } = useWorkspace();
    
    const onCancel = () => navigate('/teams');
    
    const onPublishTeam = async (team) => {
        await api.post('/api/teams', {
            name: team.name, 
            tagline: team.tagline, 
            hackathonName: team.hackathonName,
            theme: team.theme, 
            eventDate: team.eventDate, 
            description: team.description,
            requiredSkills: team.requiredSkills, 
            maxSize: team.maxSize,
            status: team.status
        });
        await reloadWorkspace();
        navigate('/teams');
    };

    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [hackathonName, setHackathonName] = useState('');
    const [theme, setTheme] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [maxSize, setMaxSize] = useState(4);
    const [error, setError] = useState('');

    // Skills State (Select + Custom)
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [showCustomSkill, setShowCustomSkill] = useState(false);
    const [customSkillInput, setCustomSkillInput] = useState('');

    // Get today's date in YYYY-MM-DD format to disable past dates in the calendar
    const todayString = new Date().toISOString().split('T')[0];

    // --- Skills Handlers ---
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setShowCustomSkill(true);
            setSelectedSkill('');
        } else {
            setShowCustomSkill(false);
            setSelectedSkill(value);
        }
    };

    const handleAddSkill = () => {
        const skillToAdd = showCustomSkill ? customSkillInput.trim() : selectedSkill;
        if (skillToAdd && !requiredSkills.includes(skillToAdd)) {
            setRequiredSkills([...requiredSkills, skillToAdd]);
            setCustomSkillInput('');
            setSelectedSkill('');
            setShowCustomSkill(false);
        }
    };

    const handleRemoveSkill = (skill) => {
        setRequiredSkills(requiredSkills.filter(s => s !== skill));
    };

    // --- Form Submit Handler ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name || !tagline || !description || !theme || !hackathonName || !eventDate) {
            setError('Please fill in all required fields, including the event date.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        if (requiredSkills.length === 0) {
            setError('Please list at least one required developer skill.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Defensive check: just in case they bypass the HTML min attribute
        const today = new Date();
        const selectedDate = new Date(eventDate);
        today.setHours(0, 0, 0, 0); 
        
        const computedStatus = selectedDate < today ? 'completed' : 'open';
        
        onPublishTeam({
            name,
            tagline,
            description,
            hackathonName,
            eventDate, 
            theme,
            requiredSkills,
            maxSize,
            status: computedStatus
        });
    };

    // Helper to format date for the live preview
    const formatPreviewDate = (dateString) => {
        if (!dateString) return 'Date TBA';
        return new Date(dateString).toLocaleDateString('en-US', { 
           day: 'numeric', month: 'short', year: 'numeric' 
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
      {/* Cancel button */}
      <button onClick={onCancel} className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-all py-1">
        <ArrowLeft className="w-4.5 h-4.5"/>
        <span>Back to Team Finder</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Create Form */}
        <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-[32px] border border-outline-custom/30 shadow-card space-y-6">
          <div className="border-b border-outline-custom/15 pb-4">
            <h2 className="text-xl font-extrabold text-text-primary font-display flex items-center gap-2">
              <Sparkles className="text-primary-indigo w-5 h-5"/>
              <span>Assemble Your Hackathon Squad</span>
            </h2>
            <p className="text-text-secondary text-xs mt-0.5">Let other students know what problems you aim to solve and who you need on your team</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Hackathon Name & Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Hackathon Target</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Smart India Hackathon" 
                  value={hackathonName} 
                  onChange={(e) => setHackathonName(e.target.value)} 
                  className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Focus Theme</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. AI Healthcare, DeFi Liquidity" 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)} 
                  className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
                />
              </div>
            </div>

            {/* Squad Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Trivega" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Tagline</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Real-time satellite classifications for urban forestry" 
                value={tagline} 
                onChange={(e) => setTagline(e.target.value)} 
                className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Concept Overview</label>
              <textarea 
                required 
                rows={3} 
                placeholder="Briefly pitch your project idea. What technologies will you deploy? What problem are you addressing? Also share the details of Hackathon event and be engaging!" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo resize-none"
              />
            </div>

            {/* Size & Event Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Event Date</label>
                <input 
                  type="date" 
                  required 
                  min={todayString}  // Prevents selecting past dates in the calendar picker
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)} 
                  className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Max Team Size</label>
                <select 
                  value={maxSize} 
                  onChange={(e) => setMaxSize(Number(e.target.value))} 
                  className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer"
                >
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                  <option value={5}>5 Members</option>
                  <option value={6}>6 Members</option>
                </select>
              </div>
            </div>

            {/* Skills required tag editor (Select + Custom) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Target Skills Needed</label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {!showCustomSkill ? (
                    <select 
                      value={selectedSkill} 
                      onChange={handleSelectChange} 
                      className="flex-1 px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer"
                    >
                      <option value="" disabled>Select a skill...</option>
                      {ALL_SKILLS.map(skill => (
                        <option key={skill} value={skill} disabled={requiredSkills.includes(skill)}>{skill}</option>
                      ))}
                      <option value="OTHER" className="font-bold text-primary-indigo">Other (Add custom skill)...</option>
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={customSkillInput} 
                      onChange={(e) => setCustomSkillInput(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Type a custom skill..." 
                      className="flex-1 px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"
                      autoFocus
                    />
                  )}
                  
                  <button 
                    type="button" 
                    onClick={handleAddSkill} 
                    disabled={!selectedSkill && !customSkillInput}
                    className="px-4 py-3 bg-primary-indigo text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                {showCustomSkill && (
                  <button type="button" onClick={() => { setShowCustomSkill(false); setCustomSkillInput(''); }} className="text-[10px] text-text-secondary underline text-left px-1">
                    Back to list
                  </button>
                )}
              </div>
            </div>

            {/* List of current added skills */}
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3.5 bg-sahyog-bg/40 border border-outline-custom/10 rounded-2xl">
                {requiredSkills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-outline-custom/30 text-[10px] font-bold text-text-secondary rounded-full">
                    <span>{s}</span>
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-custom/15">
              <button type="button" onClick={onCancel} className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-3 bg-primary-indigo hover:bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md shadow-primary-indigo/10 transition-all flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]"/>
                <span>Publish Squad Listing</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right column: LIVE PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-6">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">Live Grid Preview</h4>
          
          <div className="bg-white p-6 rounded-[32px] border border-outline-custom/35 shadow-2xl relative overflow-hidden space-y-4">
            
            {/* Soft decorative background in preview */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary-indigo/5 blur-[30px]"/>
            
            <div className="flex justify-between items-start gap-4">
              <span className="text-[9px] font-black bg-primary-indigo/5 text-primary-indigo px-2.5 py-1 rounded-full border border-primary-indigo/10 uppercase tracking-widest">
                {hackathonName || 'Hackathon Name'}
              </span>
              <span className="text-[9px] font-black bg-white/50 text-text-secondary px-2.5 py-1 rounded-full border border-outline-custom/20 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatPreviewDate(eventDate)}</span>
              </span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-text-primary font-display">{name || 'Your Squad Name'}</h3>
              <p className="text-text-secondary text-xs mt-1 font-semibold italic">{tagline || 'Your catchy tagline will float here...'}</p>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
              {description || 'Your concept overview details, target problem statement, and technical framework explanations will occupy this block...'}
            </p>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Required Skills Needed:</p>
              <div className="flex flex-wrap gap-1">
                {requiredSkills.length === 0 ? (
                  <span className="text-[10px] text-text-secondary/50 italic font-semibold">List skills above...</span>
                ) : (
                  requiredSkills.map(skill => (
                    <span key={skill} className="text-[9px] bg-sahyog-bg text-text-primary px-2 py-0.5 rounded-full border border-outline-custom/15 font-semibold">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-outline-custom/10">
              <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                <Users className="w-4 h-4 text-primary-indigo"/>
                <span>1 / {maxSize} Joined</span>
              </div>
              <span className="text-[10px] font-bold text-primary-indigo uppercase tracking-wider">Inspect Squad →</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};