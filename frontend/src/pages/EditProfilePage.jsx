import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { normalizeUser } from '../api/mappers.js';
import { SkillTag } from '../components/BadgesAndTags';
import { Code2, BriefcaseBusiness, Check, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';

// Comprehensive list of skills for the dropdowns
const ALL_SKILLS = [
  'AWS', 'C++', 'Data Science', 'Docker', 'Figma', 'Go', 'Java', 'JavaScript', 
  'Machine Learning', 'Next.js', 'Node.js', 'Python', 'PyTorch', 'React', 'Rust', 
  'Solidity', 'Tailwind CSS', 'TypeScript', 'UI/UX', 'Web3'
];

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useWorkspace();
    const { login } = useAuth();
    
    const [validationError, setValidationError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const onCancel = () => navigate(`/profile/${currentUser.id}`);
    
    const onSaveProfile = async (profile) => {
        const res = await api.put('/api/users/profile', {
            name: profile.name,
            college: profile.college,
            bio: profile.bio,
            skillsToTeach: profile.skillsToTeach,
            skillsToLearn: profile.skillsToLearn,
            openToLearnAll: profile.isOpenToLearnAnything,
            githubUrl: profile.github,
            linkedinUrl: profile.linkedin,
        });
        login(localStorage.getItem('token'), normalizeUser(res.data));
        navigate(`/profile/${currentUser.id}`);
    };

    const [name, setName] = useState(currentUser.name || '');
    const [bio, setBio] = useState(currentUser.bio || '');
    const [college, setCollege] = useState(currentUser.college || 'Stanford University');
    const [github, setGithub] = useState(currentUser.github || '');
    const [linkedin, setLinkedin] = useState(currentUser.linkedin || '');
    
    const [skillsToTeach, setSkillsToTeach] = useState(currentUser.skillsToTeach || []);
    const [skillsToLearn, setSkillsToLearn] = useState(currentUser.skillsToLearn || []);
    
    const [isOpenToLearnAnything, setIsOpenToLearnAnything] = useState(currentUser.isOpenToLearnAnything ?? true);
    const [avatar, setAvatar] = useState(currentUser.avatar);

    // Teach Select + Custom State
    const [selectedTeachSkill, setSelectedTeachSkill] = useState('');
    const [showCustomTeach, setShowCustomTeach] = useState(false);
    const [customTeachInput, setCustomTeachInput] = useState('');

    // Learn Select + Custom State
    const [selectedLearnSkill, setSelectedLearnSkill] = useState('');
    const [showCustomLearn, setShowCustomLearn] = useState(false);
    const [customLearnInput, setCustomLearnInput] = useState('');

    // --- Teach Handlers ---
    const handleTeachSelectChange = (e) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setShowCustomTeach(true);
            setSelectedTeachSkill('');
        } else {
            setShowCustomTeach(false);
            setSelectedTeachSkill(value);
        }
    };

    const handleAddTeachSkill = () => {
        const skillToAdd = showCustomTeach ? customTeachInput.trim() : selectedTeachSkill;
        if (skillToAdd && !skillsToTeach.includes(skillToAdd)) {
            setSkillsToTeach([...skillsToTeach, skillToAdd]);
            setCustomTeachInput('');
            setSelectedTeachSkill('');
            setShowCustomTeach(false);
        }
    };

    const handleRemoveTeachSkill = (skill) => {
        setSkillsToTeach(skillsToTeach.filter(s => s !== skill));
    };

    // --- Learn Handlers ---
    const handleLearnSelectChange = (e) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setShowCustomLearn(true);
            setSelectedLearnSkill('');
        } else {
            setShowCustomLearn(false);
            setSelectedLearnSkill(value);
        }
    };

    const handleAddLearnSkill = () => {
        const skillToAdd = showCustomLearn ? customLearnInput.trim() : selectedLearnSkill;
        if (skillToAdd && !skillsToLearn.includes(skillToAdd)) {
            setSkillsToLearn([...skillsToLearn, skillToAdd]);
            setCustomLearnInput('');
            setSelectedLearnSkill('');
            setShowCustomLearn(false);
        }
    };

    const handleRemoveLearnSkill = (skill) => {
        setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
    };

    // --- Validation and Save ---
    const handleSave = async (e) => {
        e.preventDefault();
        setValidationError('');

        // 1. Skill Validation
        if (skillsToTeach.length === 0) {
            setValidationError('Please add at least one expertise tag (skill you can teach).');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (skillsToLearn.length === 0) {
            setValidationError('Please add at least one learning target (skill you seek).');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. URLs Validation
        const trimmedGithub = github.trim();
        const trimmedLinkedin = linkedin.trim();

        if (!trimmedGithub && !trimmedLinkedin) {
            setValidationError('Please provide at least one profile link (GitHub or LinkedIn).');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (trimmedGithub) {
            try {
                const ghUrl = new URL(trimmedGithub);
                if (!ghUrl.hostname.includes('github.com')) {
                    setValidationError('Please enter a valid GitHub URL (must include github.com).');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            } catch (err) {
                setValidationError('Please enter a valid GitHub URL format (e.g., https://github.com/username).');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        if (trimmedLinkedin) {
            if (trimmedLinkedin.toLowerCase().includes('linkedln')) {
                setValidationError('Invalid LinkedIn URL: Please check your spelling (linkedln is not allowed).');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            try {
                const liUrl = new URL(trimmedLinkedin);
                if (!liUrl.hostname.includes('linkedin.com')) {
                    setValidationError('Please enter a valid LinkedIn URL (must include linkedin.com).');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            } catch (err) {
                setValidationError('Please enter a valid LinkedIn URL format (e.g., https://linkedin.com/in/username).');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        // 3. Execution
        setIsSaving(true);
        try {
            await onSaveProfile({
                name,
                bio,
                college,
                github: trimmedGithub,
                linkedin: trimmedLinkedin,
                skillsToTeach,
                skillsToLearn,
                isOpenToLearnAnything,
                avatar
            });
        } catch (error) {
            setValidationError('Failed to update profile. Please check your connection and try again.');
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans pb-24 lg:pb-8">
      
      {/* Back button */}
      <button onClick={onCancel} className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-all py-1">
        <ArrowLeft className="w-4.5 h-4.5"/>
        <span>Cancel Customization</span>
      </button>

      <div className="bg-white p-8 rounded-[32px] border border-outline-custom/30 shadow-card space-y-8">
        
        <div className="border-b border-outline-custom/15 pb-4">
          <h2 className="text-xl font-extrabold text-text-primary font-display">Customize Academic Profile</h2>
          <p className="text-text-secondary text-xs mt-0.5">Customize how other college collaborators view your skillset overlaps</p>
        </div>

        {validationError && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Area */}
          <div className="flex items-center gap-4.5 bg-sahyog-bg/40 p-4 rounded-2xl border border-outline-custom/10">
            <img src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} alt="Avatar Profile" className="w-16 h-16 rounded-full object-cover border border-outline-custom/25 shadow-sm"/>
            <div>
              <p className="text-xs font-bold text-text-primary">Avatar Representative</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">University / College</label>
              <select value={college} onChange={(e) => setCollege(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary cursor-pointer">
                <option value="Stanford University">Stanford University</option>
                <option value="IIT Bombay">IIT Bombay</option>
                <option value="UC Berkeley">UC Berkeley</option>
                <option value="Massachusetts Institute of Technology">Massachusetts Institute of Technology</option>
                <option value="University of Oxford">University of Oxford</option>
                <option value="Ashesi University">Ashesi University</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Biography</label>
            <textarea required rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary resize-none"/>
          </div>

          {/* Socials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5"/>
                <span>GitHub URL</span>
              </label>
              <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1 flex items-center gap-1">
                <BriefcaseBusiness className="w-3.5 h-3.5"/>
                <span>LinkedIn URL</span>
              </label>
              <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
            </div>
          </div>

          {/* Tag Editors (Teach) */}
          <div className="space-y-3 p-5 rounded-2xl border border-outline-custom/15 bg-sahyog-bg/25">
            <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Expertise Tags (What Can You Teach?)</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {!showCustomTeach ? (
                  <select 
                    value={selectedTeachSkill} 
                    onChange={handleTeachSelectChange} 
                    className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary cursor-pointer"
                  >
                    <option value="" disabled>Select a skill...</option>
                    {ALL_SKILLS.map(skill => (
                      <option key={skill} value={skill} disabled={skillsToTeach.includes(skill)}>{skill}</option>
                    ))}
                    <option value="OTHER" className="font-bold text-primary-indigo">Other (Add custom skill)...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={customTeachInput} 
                    onChange={(e) => setCustomTeachInput(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTeachSkill();
                      }
                    }} 
                    placeholder="Type a custom skill..." 
                    className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"
                    autoFocus
                  />
                )}
                
                <button type="button" onClick={handleAddTeachSkill} disabled={!selectedTeachSkill && !customTeachInput} className="px-4 py-2.5 bg-primary-indigo text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50">
                  Add
                </button>
              </div>
              
              {showCustomTeach && (
                <button type="button" onClick={() => { setShowCustomTeach(false); setCustomTeachInput(''); }} className="text-[10px] text-text-secondary underline text-left px-1">
                  Back to list
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsToTeach.length === 0 ? (
                <span className="text-xs text-text-secondary/60">No expertise skills added</span>
              ) : (
                skillsToTeach.map(s => (<SkillTag key={s} name={s} onRemove={() => handleRemoveTeachSkill(s)}/>))
              )}
            </div>
          </div>

          {/* Tag Editors (Learn) */}
          <div className="space-y-3 p-5 rounded-2xl border border-outline-custom/15 bg-sahyog-bg/25">
            <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Learning Targets (What Do You Seek?)</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {!showCustomLearn ? (
                  <select 
                    value={selectedLearnSkill} 
                    onChange={handleLearnSelectChange} 
                    className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary cursor-pointer"
                  >
                    <option value="" disabled>Select a skill...</option>
                    {ALL_SKILLS.map(skill => (
                      <option key={skill} value={skill} disabled={skillsToLearn.includes(skill)}>{skill}</option>
                    ))}
                    <option value="OTHER" className="font-bold text-primary-indigo">Other (Add custom skill)...</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={customLearnInput} 
                    onChange={(e) => setCustomLearnInput(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLearnSkill();
                      }
                    }} 
                    placeholder="Type learning target..." 
                    className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"
                    autoFocus
                  />
                )}
                
                <button type="button" onClick={handleAddLearnSkill} disabled={!selectedLearnSkill && !customLearnInput} className="px-4 py-2.5 bg-primary-indigo text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50">
                  Add
                </button>
              </div>

              {showCustomLearn && (
                <button type="button" onClick={() => { setShowCustomLearn(false); setCustomLearnInput(''); }} className="text-[10px] text-text-secondary underline text-left px-1">
                  Back to list
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsToLearn.length === 0 ? (
                <span className="text-xs text-text-secondary/60">No learning targets added</span>
              ) : (
                skillsToLearn.map(s => (<SkillTag key={s} name={s} onRemove={() => handleRemoveLearnSkill(s)}/>))
              )}
            </div>
          </div>

          {/* Open to learn Anything status toggle */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 rounded-2xl">
            <div>
              <h4 className="text-xs font-extrabold text-emerald-950">"Open to Learn Anything" Status</h4>
              <p className="text-[10px] text-emerald-800 mt-0.5 leading-relaxed">Displays a friendly green pulsing badge so mentors reach out proactively.</p>
            </div>
            <button type="button" onClick={() => setIsOpenToLearnAnything(!isOpenToLearnAnything)} className="text-emerald-600 focus:outline-none">
              {isOpenToLearnAnything ? (<ToggleRight className="w-12 h-12"/>) : (<ToggleLeft className="w-12 h-12 text-slate-300"/>)}
            </button>
          </div>

          {/* Save buttons footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-custom/15">
            <button type="button" onClick={onCancel} disabled={isSaving} className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors disabled:opacity-50">
              Discard
            </button>
            <button type="submit" disabled={isSaving} className="px-6 py-3 bg-primary-indigo hover:bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md shadow-primary-indigo/10 transition-all flex items-center gap-1.5 disabled:opacity-70">
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]"/>
                  <span>Save Academic Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfilePage;