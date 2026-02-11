
import React, { useState, useMemo } from 'react';
import { ScannedDocument, StudyPlan } from '../types';
import { ArrowLeft, BookOpen, Clock, Lightbulb, Target, CheckCircle2, CalendarDays, LayoutList, Calendar as CalendarIcon, Flag } from 'lucide-react';

interface StudyPlanPageProps {
  document: ScannedDocument;
  onBack: () => void;
}

export const StudyPlanPage: React.FC<StudyPlanPageProps> = ({ document, onBack }) => {
  const plan = document.studyPlan;
  const [viewMode, setViewMode] = useState<'timeline' | 'month'>('timeline');

  // Calculate estimated completion date
  const estimatedCompletion = useMemo(() => {
    if (!plan?.schedule) return null;
    const today = new Date();
    // Assuming schedule days are sequential (Day 1, Day 2...)
    const days = plan.schedule.length;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);
    return endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [plan]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] flex-col gap-4">
        <p className="text-red-500 font-mono">ERROR: NO_STUDY_PLAN_FOUND</p>
        <button onClick={onBack} className="text-white hover:underline">Go Back</button>
      </div>
    );
  }

  // Generate a vertical list for the entire current month
  const renderMonthView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for(let d=1; d<=daysInMonth; d++) {
        days.push(new Date(currentYear, currentMonth, d));
    }

    return (
        <div className="space-y-0 relative pl-6 sm:pl-0 animate-in fade-in duration-500">
             {/* Gradient Timeline Line */}
             <div className="absolute left-[29px] sm:left-[149px] top-4 bottom-4 w-px bg-white/10"></div>

             {days.map((date, idx) => {
                 // Calculate mapping to plan
                 // Plan starts TODAY. 
                 // diffDays = 0 for Today. -1 for Yesterday.
                 const diffTime = date.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                 
                 const scheduleItem = diffDays >= 0 && diffDays < plan.schedule.length ? plan.schedule[diffDays] : null;
                 const isToday = diffDays === 0;
                 const isPast = diffDays < 0;

                 return (
                     <div key={idx} className={`relative sm:pl-48 py-6 group flex flex-col sm:block ${isPast ? 'opacity-30 grayscale' : ''}`}>
                         
                         {/* Date Label (Left Side on Desktop) */}
                         <div className="sm:absolute sm:left-0 sm:top-6 sm:w-32 sm:text-right mb-2 sm:mb-0 pl-12 sm:pl-0">
                             <div className={`font-mono text-xl font-bold uppercase tracking-widest leading-none ${isToday ? 'text-[#F25F4C]' : 'text-white'}`}>
                                 {date.getDate()} {date.toLocaleDateString('default', { month: 'short' })}
                             </div>
                             <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                                 {date.toLocaleDateString('default', { weekday: 'long' })}
                             </div>
                         </div>

                         {/* Node on Line */}
                         <div className={`
                            absolute left-[23px] sm:left-[143px] top-[28px] sm:top-[26px] w-3.5 h-3.5 rounded-full border-2 z-10 transition-transform duration-300
                            ${isToday ? 'bg-[#F25F4C] border-[#F25F4C] scale-125 shadow-[0_0_15px_#F25F4C]' : scheduleItem ? 'bg-black border-white group-hover:border-[#F25F4C]' : 'bg-black border-white/20'}
                         `}></div>

                         {/* Content */}
                         <div className="pl-12 sm:pl-8">
                             {scheduleItem ? (
                                 <div className="space-y-3">
                                     {scheduleItem.sessions.map((session, sIdx) => (
                                          <div key={sIdx} className="bg-[#111] border border-white/10 rounded-xl p-4 hover:border-[#F25F4C] hover:bg-[#161616] transition-colors relative group/card">
                                               {/* Decorative Accent */}
                                               <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#F25F4C] rounded-r opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                               
                                               <div className="flex flex-col gap-1">
                                                   <div className="flex justify-between items-start gap-4">
                                                       <h4 className="font-bold text-gray-200 text-sm group-hover/card:text-white leading-tight">{session.topic}</h4>
                                                       <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-0.5 rounded shrink-0">{session.duration}</span>
                                                   </div>
                                                   <p className="text-xs text-gray-400 line-clamp-2">{session.activity}</p>
                                               </div>
                                          </div>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="h-8 flex items-center">
                                     <span className="text-[10px] text-gray-700 font-mono uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full">
                                         {isPast ? 'History' : 'Rest / Free Day'}
                                     </span>
                                 </div>
                             )}
                         </div>
                     </div>
                 );
             })}
        </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/20 pb-8 gap-8">
         <div className="space-y-4">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold mb-4"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-5xl md:text-7xl font-anton uppercase tracking-tighter leading-none text-white">
                Study Plan
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <p className="font-mono text-sm text-[#F25F4C] uppercase tracking-widest flex items-center gap-2">
                    Target: {document.title} <span className="text-gray-600">///</span> Deep Analysis Mode
                </p>
                {estimatedCompletion && (
                    <div className="flex items-center gap-2 text-sm font-medium text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <Flag size={14} className="text-[#F25F4C]" />
                        <span>Est. Completion: <span className="text-[#F25F4C]">{estimatedCompletion}</span></span>
                    </div>
                )}
            </div>
         </div>
         
         {/* View Toggle */}
         <div className="flex bg-[#111] p-1 rounded-lg border border-white/10">
            <button 
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${viewMode === 'timeline' ? 'bg-[#F25F4C] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                <LayoutList size={16} /> Timeline
            </button>
            <button 
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${viewMode === 'month' ? 'bg-[#F25F4C] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                <CalendarIcon size={16} /> Month View
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Strategy & Tips (Sticky) */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-24">
              
              {/* Overview Card */}
              <div className="bg-[#111] rounded-3xl p-8 border border-white/10 relative overflow-hidden group hover:border-[#F25F4C]/30 transition-colors">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Target size={100} />
                  </div>
                  <h3 className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-4">Strategic Overview</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                      {plan.overview}
                  </p>
              </div>

              {/* Prerequisites */}
              <div className="bg-[#111] rounded-3xl p-8 border border-white/10 hover:border-[#F25F4C]/30 transition-colors">
                   <h3 className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-4">Required Materials</h3>
                   <ul className="space-y-3">
                       {plan.prerequisites?.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                               <CheckCircle2 size={16} className="mt-0.5 text-gray-600 shrink-0" />
                               {item}
                           </li>
                       ))}
                   </ul>
              </div>

               {/* Tips */}
               <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-3xl p-8 border border-white/10">
                   <h3 className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Lightbulb size={14} /> Pro Tips
                   </h3>
                   <ul className="space-y-4">
                       {plan.tips?.map((tip, idx) => (
                           <li key={idx} className="text-sm text-gray-400 border-l-2 border-[#F25F4C]/30 pl-4 py-1">
                               {tip}
                           </li>
                       ))}
                   </ul>
              </div>

          </div>

          {/* RIGHT COLUMN: Schedule Timeline or Month View */}
          <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <CalendarDays className="text-[#F25F4C]" />
                      Execution Schedule
                  </h3>
              </div>

              {viewMode === 'month' ? (
                  renderMonthView()
              ) : (
                  <div className="space-y-8 relative pl-6">
                      {/* Gradient Timeline Line */}
                      <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#F25F4C] via-[#F25F4C]/50 to-transparent"></div>

                      {plan.schedule.map((day, idx) => (
                          <div 
                            key={idx} 
                            className="relative pl-12 animate-slide-right group" 
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                              
                              {/* Glowing Node */}
                              <div className="absolute left-[23px] top-8 w-3.5 h-3.5 bg-[#000] rounded-full border-2 border-[#F25F4C] z-10 shadow-[0_0_10px_#F25F4C] group-hover:scale-125 transition-transform duration-300"></div>
                              <div className="absolute left-[23px] top-8 w-3.5 h-3.5 bg-[#F25F4C] rounded-full animate-ping opacity-20"></div>

                              {/* Day Label */}
                              <div className="flex items-center gap-4 mb-4">
                                  <span className="text-[#F25F4C] font-mono text-lg font-bold uppercase tracking-widest">
                                      {day.day}
                                  </span>
                                  <div className="h-px flex-1 bg-white/10"></div>
                              </div>

                              {/* Sessions */}
                              <div className="space-y-4">
                                  {day.sessions.map((session, sIdx) => (
                                      <div 
                                        key={sIdx} 
                                        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-[#F25F4C] hover:bg-[#111] hover:shadow-[0_0_30px_rgba(242,95,76,0.1)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                                      >
                                          <div className="absolute top-0 left-0 w-1 h-full bg-[#F25F4C] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                          
                                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                              <h4 className="text-xl font-bold text-white group-hover:text-[#F25F4C] transition-colors">
                                                  {session.topic}
                                              </h4>
                                              <span className="flex items-center gap-2 text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/5">
                                                  <Clock size={12} /> {session.duration}
                                              </span>
                                          </div>
                                          
                                          <div className="text-sm">
                                              <p className="text-gray-400 leading-relaxed">{session.activity}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};
