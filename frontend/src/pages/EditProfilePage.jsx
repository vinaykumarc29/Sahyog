import React, { useState } from 'react';
import { SkillTag } from '../components/BadgesAndTags';
import { Code2, BriefcaseBusiness, Check, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
export const EditProfilePage = ({ currentUser, onSaveProfile, onCancel }) => {
    const [name, setName] = useState(currentUser.name);
    const [bio, setBio] = useState(currentUser.bio);
    const [college, setCollege] = useState(currentUser.college);
    const [github, setGithub] = useState(currentUser.github);
    const [linkedin, setLinkedin] = useState(currentUser.linkedin);
    const [skillsToTeach, setSkillsToTeach] = useState(currentUser.skillsToTeach);
    const [skillsToLearn, setSkillsToLearn] = useState(currentUser.skillsToLearn);
    const [isOpenToLearnAnything, setIsOpenToLearnAnything] = useState(currentUser.isOpenToLearnAnything);
    const [teachInput, setTeachInput] = useState('');
    const [learnInput, setLearnInput] = useState('');
    const [avatar, setAvatar] = useState(currentUser.avatar);
    const handleAddTeachSkill = () => {
        if (teachInput && !skillsToTeach.includes(teachInput)) {
            setSkillsToTeach([...skillsToTeach, teachInput]);
            setTeachInput('');
        }
    };
    const handleAddLearnSkill = () => {
        if (learnInput && !skillsToLearn.includes(learnInput)) {
            setSkillsToLearn([...skillsToLearn, learnInput]);
            setLearnInput('');
        }
    };
    const handleRemoveTeachSkill = (skill) => {
        setSkillsToTeach(skillsToTeach.filter(s => s !== skill));
    };
    const handleRemoveLearnSkill = (skill) => {
        setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
    };
    const handleSave = (e) => {
        e.preventDefault();
        onSaveProfile({
            name,
            bio,
            college,
            github,
            linkedin,
            skillsToTeach,
            skillsToLearn,
            isOpenToLearnAnything,
            avatar
        });
    };
    // Avatar cycle simulation
    // const cycleAvatar = () => {
    //     const avatars = [
    //         'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    //         'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    //         'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    //         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    //     ];
    //     const currentIndex = avatars.indexOf(avatar);
    //     const nextIndex = (currentIndex + 1) % avatars.length;
    //     setAvatar(avatars[nextIndex]);
    // };
    return (<div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans pb-24 lg:pb-8">
      
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

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar simulation */}
          <div className="flex items-center gap-4.5 bg-sahyog-bg/40 p-4 rounded-2xl border border-outline-custom/10">
            <img src={avatar} alt="Avatar Profile" className="w-16 h-16 rounded-full object-cover border border-outline-custom/25 shadow-sm"/>
            <div>
              <p className="text-xs font-bold text-text-primary">Avatar Representative</p>
              {/* <button type="button" onClick={cycleAvatar} className="mt-1.5 px-3 py-1.5 bg-white border border-outline-custom/30 hover:border-primary-indigo hover:text-primary-indigo rounded-full text-[10px] font-black tracking-wide uppercase transition-colors">
                Cycle Avatar Image
              </button> */}
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
            <div className="flex gap-2">
              <input type="text" value={teachInput} onChange={(e) => setTeachInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeachSkill())} placeholder="Add teachable skill..." className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
              <button type="button" onClick={handleAddTeachSkill} className="px-4 py-2.5 bg-primary-indigo text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsToTeach.map(s => (<SkillTag key={s} name={s} onRemove={() => handleRemoveTeachSkill(s)}/>))}
            </div>
          </div>

          {/* Tag Editors (Learn) */}
          <div className="space-y-3 p-5 rounded-2xl border border-outline-custom/15 bg-sahyog-bg/25">
            <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Learning Targets (What Do You Seek?)</label>
            <div className="flex gap-2">
              <input type="text" value={learnInput} onChange={(e) => setLearnInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnSkill())} placeholder="Add learning target..." className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo"/>
              <button type="button" onClick={handleAddLearnSkill} className="px-4 py-2.5 bg-primary-indigo text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsToLearn.map(s => (<SkillTag key={s} name={s} onRemove={() => handleRemoveLearnSkill(s)}/>))}
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
            <button type="button" onClick={onCancel} className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">
              Discard
            </button>
            <button type="submit" className="px-6 py-3 bg-primary-indigo hover:bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md shadow-primary-indigo/10 transition-all flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]"/>
              <span>Save Academic Changes</span>
            </button>
          </div>

        </form>

      </div>

    </div>);
};
