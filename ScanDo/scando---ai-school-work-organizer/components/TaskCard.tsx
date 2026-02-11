
import React from 'react';
import { ScannedDocument, Priority } from '../types';
import { CheckCircle2, Circle, ArrowUpRight, FileText, Loader2, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  document: ScannedDocument;
  onClick: () => void;
  index?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ document, onClick, index = 0 }) => {
  const completedCount = document.tasks.filter(t => t.isCompleted).length;
  const totalCount = document.tasks.length;
  const hasHighPriority = document.tasks.some(t => t.priority === Priority.High && !t.isCompleted);

  // Animation delay based on index
  const style = { animationDelay: `${index * 100}ms` };

  if (document.status === 'processing') {
    return (
      <div 
        className="group relative w-full bg-[#050505] aspect-[3/4] flex flex-col items-center justify-center border border-white/10 animate-pop-in overflow-hidden"
        style={style}
      >
        {/* Vertical Scanning Bar Animation */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-0 right-0 h-1 bg-[#F25F4C] shadow-[0_0_20px_#F25F4C] animate-scan-beam z-10"></div>
             {/* Subtle grid background */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        <div className="relative z-10 text-center p-6 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#F25F4C] mb-2 animate-pulse">Processing</p>
            <p className="text-[10px] text-gray-500 font-mono">EXTRACTING_DATA...</p>
        </div>
        
        <div className="absolute inset-0 border-2 border-[#F25F4C] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
      </div>
    );
  }

  if (document.status === 'error') {
     return (
      <div 
        className="w-full bg-[#1a0505] aspect-[3/4] flex flex-col items-center justify-center border border-red-900/50 p-6 text-center animate-pop-in"
        style={style}
      >
        <p className="font-bold font-mono text-red-600 mb-2">ERROR_LOAD</p>
        <p className="text-xs text-red-500">File extraction failed.</p>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col gap-4 cursor-pointer animate-pop-in"
      style={style}
    >
      {/* 1. Image Area - Black background for contrast */}
      {/* UPDATED: Added persistent border-white/10 and subtle shadow */}
      <div className="relative w-full aspect-square bg-[#000] overflow-hidden border border-white/10 group-hover:border-[#F25F4C] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(242,95,76,0.15)]">
        {document.fileType === 'image' ? (
          <img 
            src={document.originalFileUrl} 
            alt={document.title} 
            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText size={48} className="text-[#F25F4C] group-hover:scale-110 transition-transform" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#F25F4C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* 2. Metadata Area - ORANGE BOX as requested */}
      <div className="flex flex-col gap-3 bg-[#F25F4C] p-4 -mt-2 relative z-10 shadow-lg group-hover:translate-y-[-4px] transition-transform duration-300">
        
        <div className="flex justify-between items-start border-b border-black/20 pb-3">
            <h3 className="font-bold text-lg leading-none uppercase tracking-tight max-w-[75%] text-black line-clamp-2">
              {document.title}
            </h3>
            <span className="font-mono text-sm font-bold text-black/60 shrink-0">
                {completedCount}/{totalCount}
            </span>
        </div>

        {/* Priority / Date */}
        <div className="flex items-center gap-2 h-4 text-black">
            {hasHighPriority ? (
                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-black text-[#F25F4C] px-1.5 py-0.5">
                    <AlertCircle size={8} /> High Priority
                 </span>
            ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">Normal Priority</span>
            )}
            <div className="flex-1"></div>
            <span className="text-[10px] font-mono font-bold text-black/50">
                {new Date(document.createdAt).toLocaleDateString()}
            </span>
        </div>

        {/* 3. Action Button - Black button inside Orange card */}
        <button className="w-full py-3 mt-1 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center gap-2">
            View Tasks
            <ArrowUpRight size={14} />
        </button>

      </div>
    </div>
  );
};
