import React, { useState } from 'react';
import { Sparkles, Users, ArrowLeft, Check } from 'lucide-react';
export const CreateTeamPage = ({ onPublishTeam, onCancel }) => {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [hackathonName, setHackathonName] = useState('TreeHacks 2026');
    const [theme, setTheme] = useState('');
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [maxSize, setMaxSize] = useState(4);
    const [error, setError] = useState('');
    const handleAddSkill = () => {
        if (skillInput && !requiredSkills.includes(skillInput)) {
            setRequiredSkills([...requiredSkills, skillInput]);
            setSkillInput('');
        }
    };
    const handleRemoveSkill = (skill) => {
        setRequiredSkills(requiredSkills.filter(s => s !== skill));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !tagline || !description || !theme) {
            setError('Please fill in all required fields.');
            return;
        }
        if (requiredSkills.length === 0) {
            setError('Please list at least one required developer skill.');
            return;
        }
        onPublishTeam({
            name,
            tagline,
            description,
            hackathonName,
            hackathonDate: hackathonName === 'TreeHacks 2026' ? 'Feb 13 - 15, 2026' : 'Mar 06 - 08, 2026',
            theme,
            requiredSkills,
            maxSize,
            openPositions: ['Fullstack Developer', 'UI/UX Lead']
        });
    };
    return (<div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
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

          {error && (<div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100">
              {error}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Hackathon Name & Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Hackathon Target</label>
                <select value={hackathonName} onChange={(e) => setHackathonName(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer">
                  <option value="TreeHacks 2026">TreeHacks 2026 (Stanford)</option>
                  <option value="MIT Web3 Hackathon">MIT Web3 Hackathon</option>
                  <option value="Stanford HackHLTH">Stanford HackHLTH</option>
                  <option value="CalHacks 13.0">CalHacks 13.0 (UC Berkeley)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Focus Theme</label>
                <input type="text" required placeholder="e.g. AI Healthcare, DeFi Liquidity" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
              </div>
            </div>

            {/* Squad Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Name</label>
              <input type="text" required placeholder="e.g. EcoSphere AI" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Squad Tagline</label>
              <input type="text" required placeholder="e.g. Real-time satellite classifications for urban forestry" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Concept Overview</label>
              <textarea required rows={3} placeholder="Briefly pitch your project idea. What technologies will you deploy? What problem are you addressing? Be engaging!" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo resize-none"/>
            </div>

            {/* Size & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Max Team Size</label>
                <select value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer">
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                </select>
              </div>

              {/* Skills required tag editor */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Target Skills Needed</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. React, PyTorch" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} className="flex-1 px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
                  <button type="button" onClick={handleAddSkill} className="px-4 py-3 bg-primary-indigo text-white rounded-2xl text-xs font-bold">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* List of current added skills */}
            {requiredSkills.length > 0 && (<div className="flex flex-wrap gap-1.5 p-3.5 bg-sahyog-bg/40 border border-outline-custom/10 rounded-2xl">
                {requiredSkills.map(s => (<span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-outline-custom/30 text-[10px] font-bold text-text-secondary rounded-full">
                    <span>{s}</span>
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-500">×</button>
                  </span>))}
              </div>)}

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
                {hackathonName}
              </span>
              <span className="text-[9px] font-black bg-emerald-50 text-success-custom px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                Recruiting
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
                {requiredSkills.length === 0 ? (<span className="text-[10px] text-text-secondary/50 italic font-semibold">List skills above...</span>) : (requiredSkills.map(skill => (<span key={skill} className="text-[9px] bg-sahyog-bg text-text-primary px-2 py-0.5 rounded-full border border-outline-custom/15 font-semibold">
                      {skill}
                    </span>)))}
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

    </div>);
};
