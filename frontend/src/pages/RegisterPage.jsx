import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User as UserIcon, Code2, BriefcaseBusiness, BookOpen, ToggleLeft, ToggleRight, Sparkle, Award } from 'lucide-react';
import { SkillTag } from '../components/BadgesAndTags';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterPage = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const totalSteps = 5;
    // Step 1: Basic Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [college, setCollege] = useState('Stanford University');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Prefer not to say');
    // Step 2: Skills I can teach
    const [teachSkills, setTeachSkills] = useState(['React', 'TypeScript', 'Figma']);
    const [customTeachInput, setCustomTeachInput] = useState('');
    // Step 3: Skills I want to learn
    const [learnSkills, setLearnSkills] = useState(['Rust', 'Machine Learning']);
    const [customLearnInput, setCustomLearnInput] = useState('');
    // Step 4: Socials
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    // Step 5: Open to learn anything
    const [openToLearnAll, setOpenToLearnAll] = useState(true);
    // Error handling
    const [validationError, setValidationError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    // Suggestions for tags
    const skillSuggestions = ['Python', 'Solidity', 'Go', 'Next.js', 'PyTorch', 'Data Science', 'Docker', 'C++', 'Node.js', 'Tailwind CSS'];
    const handleNextStep = () => {
        setValidationError('');
        if (step === 1) {
            if (!name || !email || !college || !bio || !password) {
                setValidationError('Please complete all basic information fields.');
                return;
            }
            if (password.length < 6) {
                setValidationError('Password must be at least 6 characters long.');
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                setValidationError('Please enter a valid university email address.');
                return;
            }
        }
        if (step === 2 && teachSkills.length === 0) {
            setValidationError('Please add at least one skill you can teach.');
            return;
        }
        if (step === 3 && learnSkills.length === 0) {
            setValidationError('Please add at least one skill you would like to learn.');
            return;
        }
        setStep(step + 1);
    };
    const handlePrevStep = () => {
        setValidationError('');
        if (step > 1) {
            setStep(step - 1);
        }
    };
    const handleAddTeachSkill = () => {
        if (customTeachInput && !teachSkills.includes(customTeachInput)) {
            setTeachSkills([...teachSkills, customTeachInput]);
            setCustomTeachInput('');
        }
    };
    const handleAddLearnSkill = () => {
        if (customLearnInput && !learnSkills.includes(customLearnInput)) {
            setLearnSkills([...learnSkills, customLearnInput]);
            setCustomLearnInput('');
        }
    };
    const handleRemoveTeachSkill = (skill) => {
        setTeachSkills(teachSkills.filter(s => s !== skill));
    };
    const handleRemoveLearnSkill = (skill) => {
        setLearnSkills(learnSkills.filter(s => s !== skill));
    };
    const goToLogin = onNavigateToLogin || (() => navigate('/login'));
    const handleCompleteOnboarding = async () => {
        setSubmitting(true);
        setValidationError('');
        try {
            const res = await api.post('/api/auth/register', {
                name,
                email,
                password,
                gender,
                college,
                bio,
                githubUrl: github,
                linkedinUrl: linkedin,
                skillsToTeach: teachSkills,
                skillsToLearn: learnSkills,
                openToLearnAll,
            });
            login(res.data.token, res.data.user);
            onRegisterSuccess?.(res.data.user);
            navigate('/dashboard');
        }
        catch (err) {
            setValidationError(err.response?.data?.message || 'Could not create your account.');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<div className="min-h-screen bg-[#FCF8FF] py-16 px-6 relative flex flex-col justify-center items-center overflow-hidden font-sans">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-indigo/5 blur-[120px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-cyan/10 blur-[120px] pointer-events-none"/>

      {/* Progress header */}
      {step <= totalSteps && (<div className="w-full max-w-xl mb-8">
          <div className="flex items-center justify-between text-xs font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
            <span>Step {step} of {totalSteps}: Onboarding Blueprint</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-outline-custom/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-indigo to-accent-cyan transition-all duration-350" style={{ width: `${(step / totalSteps) * 100}%` }}/>
          </div>
        </div>)}

      {/* Main glass workspace panel */}
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[32px] border border-white p-8 lg:p-10 shadow-2xl relative z-10">
        
        {validationError && (<div className="p-4 mb-6 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>)}

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (<div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-primary-indigo/5 text-primary-indigo rounded-2xl mb-3">
                <UserIcon className="w-6 h-6"/>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary font-display">Create Your Hub</h2>
              <p className="text-text-secondary text-xs mt-1 font-semibold">Let\'s verify your university status and construct your identity</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tejaswini Bakka" className="w-full px-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Institutional Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. yourname@stanford.edu" className="w-full px-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">University / College</label>
                <select value={college} onChange={(e) => setCollege(e.target.value)} className="w-full px-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary cursor-pointer">
                  <option value="Stanford University">Vivekanada Government college</option>
                  <option value="IIT Bombay">IIT Bombay</option>
                  <option value="UC Berkeley">City college hyderabad</option>
                  <option value="Massachusetts Institute of Technology">Massachusetts Institute of Technology</option>
                  <option value="University of Oxford">University of Oxford</option>
                  <option value="Ashesi University">Ashesi University</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary cursor-pointer">
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">Short Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell peers what you are working on, your core research fields, or what excites you about hackathons..." rows={3} className="w-full px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary resize-none"/>
              </div>
            </div>
          </div>)}

        {/* STEP 2: SKILLS I CAN TEACH */}
        {step === 2 && (<div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-indigo-50 text-primary-indigo rounded-2xl mb-3">
                <Award className="w-6 h-6"/>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary font-display">Skills You Can Teach</h2>
              <p className="text-text-secondary text-xs mt-1 font-semibold">What frameworks, designs, or systems can you guide other students in?</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={customTeachInput} onChange={(e) => setCustomTeachInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTeachSkill()} placeholder="Type a skill (e.g. C++, PyTorch) and press Enter" className="flex-1 px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
                <button type="button" onClick={handleAddTeachSkill} className="px-5 py-3 bg-primary-indigo text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-colors">
                  Add
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">My Expertise Tags:</p>
                <div className="flex flex-wrap gap-2 p-3.5 bg-sahyog-bg/40 border border-outline-custom/10 rounded-2xl min-h-16">
                  {teachSkills.length === 0 ? (<span className="text-xs text-text-secondary/60">No skills added yet</span>) : (teachSkills.map(skill => (<SkillTag key={skill} name={skill} onRemove={() => handleRemoveTeachSkill(skill)}/>)))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">Suggested for you:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.filter(s => !teachSkills.includes(s)).slice(0, 5).map(s => (<button key={s} onClick={() => setTeachSkills([...teachSkills, s])} className="px-3 py-1.5 bg-white border border-outline-custom/30 text-xs font-semibold text-text-secondary rounded-full hover:border-primary-indigo hover:text-primary-indigo transition-all">
                      + {s}
                    </button>))}
                </div>
              </div>
            </div>
          </div>)}

        {/* STEP 3: SKILLS I WANT TO LEARN */}
        {step === 3 && (<div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-cyan-50 text-secondary-cyan rounded-2xl mb-3">
                <BookOpen className="w-6 h-6"/>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary font-display">What Do You Want to Learn?</h2>
              <p className="text-text-secondary text-xs mt-1 font-semibold">Our match algorithm matches you with students who teach these specific topics</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={customLearnInput} onChange={(e) => setCustomLearnInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddLearnSkill()} placeholder="Type learning target (e.g. Solidity, Next.js) and press Enter" className="flex-1 px-4 py-3 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
                <button type="button" onClick={handleAddLearnSkill} className="px-5 py-3 bg-primary-indigo text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-colors">
                  Add
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">My Learning Targets:</p>
                <div className="flex flex-wrap gap-2 p-3.5 bg-sahyog-bg/40 border border-outline-custom/10 rounded-2xl min-h-16">
                  {learnSkills.length === 0 ? (<span className="text-xs text-text-secondary/60">No targets added yet</span>) : (learnSkills.map(skill => (<SkillTag key={skill} name={skill} onRemove={() => handleRemoveLearnSkill(skill)}/>)))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">Suggested learning targets:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.filter(s => !learnSkills.includes(s)).slice(5, 10).map(s => (<button key={s} onClick={() => setLearnSkills([...learnSkills, s])} className="px-3 py-1.5 bg-white border border-outline-custom/30 text-xs font-semibold text-text-secondary rounded-full hover:border-primary-indigo hover:text-primary-indigo transition-all">
                      + {s}
                    </button>))}
                </div>
              </div>
            </div>
          </div>)}

        {/* STEP 4: SOCIAL LINKS */}
        {step === 4 && (<div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-slate-50 text-text-primary rounded-2xl mb-3">
                <Code2 className="w-6 h-6"/>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary font-display">Social Overviews</h2>
              <p className="text-text-secondary text-xs mt-1 font-semibold">Link your developer profiles so teammates can view past work repositories</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">GitHub Profile Link</label>
                <div className="relative">
                  <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"/>
                  <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourusername" className="w-full pl-11 pr-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">LinkedIn Profile Link</label>
                <div className="relative">
                  <BriefcaseBusiness className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"/>
                  <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourusername" className="w-full pl-11 pr-4 py-3.5 bg-sahyog-bg/60 rounded-2xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
                </div>
              </div>
            </div>
          </div>)}

        {/* STEP 5: OPEN TO LEARN TOGGLE */}
        {step === 5 && (<div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-emerald-50 text-success-custom rounded-2xl mb-3">
                <Sparkle className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }}/>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary font-display">Special Feature Setup</h2>
              <p className="text-text-secondary text-xs mt-1 font-semibold">Would you like to enable the "Open To Learn Anything" status badge?</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white p-6 rounded-3xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Open to Learn Anything Status</h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">Highly visible green badge indicating to mentors and teammates that you are adventurous and eager to acquire any new skills.</p>
                </div>
                <button type="button" onClick={() => setOpenToLearnAll(!openToLearnAll)} className="text-emerald-600 focus:outline-none">
                  {openToLearnAll ? (<ToggleRight className="w-14 h-14"/>) : (<ToggleLeft className="w-14 h-14 text-slate-300"/>)}
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-success-custom shadow-md shadow-emerald-500/10 transition-transform duration-300 ${openToLearnAll ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                  <BookOpen className="w-3.5 h-3.5 animate-pulse"/>
                  <span>Open to Learn Anything</span>
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button onClick={handleCompleteOnboarding} disabled={submitting} className="w-full py-4 gradient-cta text-white font-bold rounded-full text-xs shadow-xl shadow-primary-indigo/20 flex items-center justify-center gap-2 disabled:opacity-60">
                <span>{submitting ? 'Creating Account...' : 'Finalize My Onboarding Profile'}</span>
                <Check className="w-4 h-4 stroke-[3]"/>
              </button>
            </div>
          </div>)}

        {/* COMPONENT NAVIGATION FOOTER */}
        {step <= totalSteps && (<div className="flex justify-between items-center mt-8 pt-6 border-t border-outline-custom/15">
            <button type="button" onClick={step === 1 ? goToLogin : handlePrevStep} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4"/>
              <span>{step === 1 ? 'Go to Sign In' : 'Back'}</span>
            </button>

            {step < totalSteps && (<button type="button" onClick={handleNextStep} className="flex items-center gap-2 text-xs font-bold  bg-primary-indigo hover:bg-indigo-600 px-6 py-2.5 rounded-full shadow-md shadow-primary-indigo/10 hover:scale-[1.01] transition-all">
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4"/>
              </button>)}
          </div>)}

      </div>
    </div>);
};
export default RegisterPage;
