import React from 'react';
import { Check, Sparkles, BookOpen } from 'lucide-react';
export const SkillTag = ({ name, isMatch = false, onClick, onRemove }) => {
    return (<span id={`skill-tag-${name}`} onClick={onClick} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full tracking-wide transition-all duration-200 cursor-pointer ${isMatch
            ? 'bg-gradient-to-r from-success-custom to-emerald-600 text-white shadow-sm'
            : 'bg-primary-indigo/5 text-primary-indigo hover:bg-primary-indigo/10 border border-primary-indigo/10'}`}>
      {isMatch && <Check className="w-3.5 h-3.5"/>}
      {name}
      {onRemove && (<button type="button" onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }} className="ml-1 hover:text-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-400">
          ×
        </button>)}
    </span>);
};
// Open to Learn Badge
export const OpenToLearnBadge = () => {
    return (<span id="open-to-learn-badge" className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-success-custom shadow-md shadow-emerald-500/10 hover:scale-[1.03] transition-transform duration-200">
      <BookOpen className="w-3.5 h-3.5 animate-pulse text-accent-cyan"/>
      <span>Open to Learn Anything</span>
    </span>);
};
export const MatchScoreBadge = ({ score }) => {
    // Determine color based on match percentage
    const getColorClasses = () => {
        if (score >= 80)
            return 'from-primary-indigo via-indigo-500 to-accent-cyan text-white shadow-indigo-200';
        if (score >= 50)
            return 'from-indigo-400 to-cyan-400 text-white shadow-indigo-100';
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    };
    return (<div id={`match-score-${score}`} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r shadow-lg ${getColorClasses()}`}>
      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }}/>
      <span>{score}% Match</span>
    </div>);
};
export const StatCard = ({ icon, label, value, change, isPositive = true }) => {
    return (<div className="bg-white p-5 rounded-3xl border border-outline-custom/30 shadow-card flex items-start gap-4 hover:translate-y-[-2px] transition-transform duration-200">
      <div className="p-3.5 bg-primary-indigo/5 rounded-2xl text-primary-indigo">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</p>
        <h4 className="text-2xl font-bold text-text-primary mt-1">{value}</h4>
        {change && (<p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${isPositive ? 'text-success-custom' : 'text-error-custom'}`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{change}</span>
          </p>)}
      </div>
    </div>);
};
