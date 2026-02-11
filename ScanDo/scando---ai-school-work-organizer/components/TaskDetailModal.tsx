
import React, { useState, useRef, useEffect } from 'react';
import { ScannedDocument, TaskItem, Priority } from '../types';
import { X, CheckCircle2, Circle, AlertCircle, Trash2, Scan, Crosshair, ImageOff, FileText, ZoomIn, ZoomOut, Maximize2, CheckSquare, ArrowUpRight, ArrowLeftRight, ChevronDown, BookOpen } from 'lucide-react';

interface TaskDetailModalProps {
  document: ScannedDocument;
  onClose: () => void;
  onToggleTask: (docId: string, taskId: string) => void;
  onUpdatePriority: (docId: string, taskId: string, newPriority: Priority) => void;
  onDelete: (docId: string) => void;
  onViewStudyPlan?: (docId: string) => void; // New prop
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ document, onClose, onToggleTask, onUpdatePriority, onDelete, onViewStudyPlan }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'original'>('tasks');
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [scanLineY, setScanLineY] = useState(0);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Zoom and Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset error & zoom state when document changes
  useEffect(() => {
    setImageError(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [document.id]);

  // Group tasks by category
  const groupedTasks = document.tasks.reduce((acc, task) => {
    const cat = task.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {} as Record<string, TaskItem[]>);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setScanLineY(y);

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault(); // Prevent text selection
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || scale > 1) {
       // Allow zooming via wheel
       const delta = e.deltaY * -0.01;
       const newScale = Math.min(Math.max(1, scale + delta), 5);
       setScale(newScale);
       if (newScale === 1) setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => {
      setScale(prev => {
          const newScale = Math.max(1, prev - 0.5);
          if (newScale === 1) setPosition({ x: 0, y: 0 });
          return newScale;
      });
  };

  const handleCompleteReview = () => {
      setIsCompleting(true);
      // Simulate a save/complete delay then close
      setTimeout(() => {
          onClose();
      }, 1200);
  };

  const togglePriority = (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation();
    const next = task.priority === Priority.High ? Priority.Medium : task.priority === Priority.Medium ? Priority.Low : Priority.High;
    onUpdatePriority(document.id, task.id, next);
  };

  // Generate a filler graphic if image fails
  const renderFillerContent = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-700 p-8 border border-white/5 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="z-10 bg-black/50 p-6 rounded-full border border-white/10 mb-4">
            <FileText size={48} className="text-[#F25F4C] opacity-50" />
        </div>
        <p className="z-10 font-mono text-xs uppercase tracking-widest mb-1 text-white/40">Preview Unavailable</p>
        <p className="z-10 text-[10px] text-gray-600 font-mono">{document.id.slice(0, 12)}... .RAW</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* 
         ANIMATION CHANGE: 
         Use slide-in-from-bottom to mimic "coming up" like a sheet of paper.
      */}
      <div 
        className="bg-black w-full h-[95vh] sm:h-[90vh] sm:rounded-3xl sm:max-w-6xl shadow-[0_0_100px_rgba(242,95,76,0.1)] flex flex-col sm:flex-row overflow-hidden relative border border-[#F25F4C]/20 animate-in slide-in-from-bottom duration-500 ease-out"
      >
        
        {/* CLOSE BUTTON - Top Right (Floating) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-40 p-3 bg-black/50 hover:bg-[#F25F4C] text-white hover:text-black backdrop-blur-md rounded-full transition-all border border-white/10 group shadow-lg"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* --- LEFT SIDE: IMAGE PREVIEW --- */}
        <div 
            ref={imageContainerRef}
            className={`
                w-full sm:w-1/2 bg-[#050505] relative border-b sm:border-b-0 sm:border-r border-[#F25F4C]/20 group overflow-hidden
                ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}
            `}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                setIsHoveringImage(false);
                setIsDragging(false);
            }}
            onMouseEnter={() => setIsHoveringImage(true)}
            onWheel={handleWheel}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.5)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none"></div>
            
            {/* Content Container */}
            <div className="h-64 sm:h-full w-full flex items-center justify-center relative z-10 overflow-hidden">
                 {imageError ? (
                     renderFillerContent()
                 ) : document.fileType === 'image' ? (
                     <img 
                        src={document.originalFileUrl} 
                        alt="Original" 
                        onError={() => setImageError(true)}
                        className="max-w-none transition-transform duration-100 ease-linear origin-center"
                        style={{ 
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            width: scale === 1 ? '85%' : 'auto',
                            height: scale === 1 ? '85%' : 'auto',
                            maxHeight: scale === 1 ? '85%' : 'none',
                            maxWidth: scale === 1 ? '85%' : 'none',
                            objectFit: 'contain',
                            filter: 'grayscale(0.2) contrast(1.1)', // Slight aesthetic filter
                        }}
                     />
                 ) : (
                     <iframe 
                        src={document.originalFileUrl} 
                        className="w-full h-full opacity-80"
                        title="PDF Preview"
                        onError={() => setImageError(true)}
                     />
                 )}
            </div>

            {/* Interactive Scanner Overlay (Only when not zoomed) */}
            {isHoveringImage && scale === 1 && (
                <>
                    {/* Horizontal Scan Line */}
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-[#F25F4C] shadow-[0_0_20px_#F25F4C] z-20 pointer-events-none"
                        style={{ top: scanLineY }}
                    >
                        <div className="absolute right-0 -top-2 bg-[#F25F4C] text-black text-[10px] font-mono px-1 font-bold">
                            Y:{Math.round(scanLineY)}
                        </div>
                    </div>
                </>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={handleZoomOut} 
                    className="p-2 bg-black/80 text-white rounded-full hover:bg-[#F25F4C] hover:text-black border border-white/20"
                >
                    <ZoomOut size={16} />
                </button>
                <div className="px-3 py-2 bg-black/80 text-white font-mono text-xs border border-white/20 rounded-full flex items-center">
                    {Math.round(scale * 100)}%
                </div>
                <button 
                    onClick={handleZoomIn} 
                    className="p-2 bg-black/80 text-white rounded-full hover:bg-[#F25F4C] hover:text-black border border-white/20"
                >
                    <ZoomIn size={16} />
                </button>
            </div>

            {/* Always visible tech accents */}
            <div className="absolute top-4 left-4 font-mono text-xs text-[#F25F4C]/60 flex items-center gap-2 pointer-events-none z-20">
                <Scan size={14} className="animate-pulse" />
                <span>SOURCE_PREVIEW</span>
            </div>

            {/* Data Overlay at bottom left */}
             <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#F25F4C] space-y-1 pointer-events-none z-20 bg-black/80 p-2 rounded border border-[#F25F4C]/30">
                <p>SCAN_MATRIX: ACTIVE</p>
                <p>TARGET_ID: {document.id.slice(0, 8)}</p>
            </div>
            
            {/* Corner Markers */}
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#F25F4C]/40 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#F25F4C]/40 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#F25F4C]/40 pointer-events-none"></div>
        </div>

        {/* --- RIGHT SIDE: TASKS --- */}
        <div className="w-full sm:w-1/2 flex flex-col h-full bg-black text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F25F4C] blur-[150px] opacity-5 pointer-events-none"></div>

            {/* Success Overlay on Complete */}
            {isCompleting && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-[#F25F4C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#F25F4C] animate-pop-in">
                            <CheckSquare size={40} className="text-black" />
                        </div>
                        <h2 className="text-3xl font-anton uppercase text-white mb-2">Review Complete</h2>
                        <p className="text-gray-400 font-mono text-sm">Saving progress & closing...</p>
                    </div>
                </div>
            )}

            <div className="p-8 border-b border-[#F25F4C]/20 flex items-center justify-between shrink-0 relative z-10">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Action Items</h1>
                     <p className="text-[#F25F4C] text-xs font-mono uppercase tracking-widest">{document.tasks.length} tasks extracted // {document.title}</p>
                </div>
                
                {/* View Study Plan Button */}
                {document.studyPlan && onViewStudyPlan && (
                    <button 
                        onClick={() => onViewStudyPlan(document.id)}
                        className="px-4 py-2 bg-[#F25F4C]/10 border border-[#F25F4C] text-[#F25F4C] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#F25F4C] hover:text-black transition-all flex items-center gap-2 animate-pop-in"
                    >
                        <BookOpen size={14} /> View Plan
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar relative z-10">
                {Object.entries(groupedTasks).map(([category, tasks]: [string, TaskItem[]], groupIdx) => (
                    <div key={category} className="space-y-4 animate-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#F25F4C]"></div>
                            <h3 className="text-xs font-bold text-[#F25F4C] uppercase tracking-widest">{category}</h3>
                            <div className="flex-1 h-px bg-[#F25F4C]/20"></div>
                        </div>
                        
                        <div className="space-y-3">
                            {tasks.map((task, idx) => (
                                <div 
                                    key={task.id} 
                                    className={`
                                        group flex items-start gap-4 p-4 rounded-xl transition-all duration-300
                                        ${task.isCompleted 
                                            ? 'bg-transparent border border-gray-800 opacity-40' 
                                            : 'bg-[#0a0a0a] border border-[#F25F4C]/30 hover:border-[#F25F4C] hover:shadow-[0_0_15px_rgba(242,95,76,0.15)] hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    <div 
                                      onClick={() => onToggleTask(document.id, task.id)}
                                      className={`mt-0.5 cursor-pointer transition-colors ${task.isCompleted ? 'text-green-500' : 'text-[#F25F4C] hover:scale-110'}`}
                                    >
                                        {task.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p 
                                            onClick={() => onToggleTask(document.id, task.id)}
                                            className={`cursor-pointer text-sm font-medium leading-relaxed ${task.isCompleted ? 'text-gray-500 line-through decoration-gray-700' : 'text-white'}`}
                                        >
                                            {task.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {/* Priority Toggle - Made clearer */}
                                            <button 
                                                onClick={(e) => togglePriority(e, task)}
                                                className={`
                                                    group/prio flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all hover:brightness-110 active:scale-95
                                                    ${task.priority === Priority.High 
                                                        ? 'text-[#F25F4C] bg-[#F25F4C]/10 border-[#F25F4C]' 
                                                        : task.priority === Priority.Medium
                                                            ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50'
                                                            : 'text-gray-400 bg-gray-800/50 border-gray-600'
                                                    }
                                                `}
                                                title="Click to change priority"
                                            >
                                                 {task.priority === Priority.High && <AlertCircle size={10} />}
                                                 {task.priority} Priority
                                                 <ArrowLeftRight size={10} className="opacity-0 group-hover/prio:opacity-100 transition-opacity ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Footer with Actions */}
            <div className="p-8 border-t border-[#F25F4C]/20 bg-black/50 backdrop-blur-sm sm:rounded-br-3xl relative z-10 flex gap-4">
                <button 
                  onClick={() => onDelete(document.id)}
                  className="px-4 py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  title="Delete Document"
                >
                  <Trash2 size={20} />
                </button>

                <button 
                  onClick={handleCompleteReview}
                  disabled={isCompleting}
                  className="flex-1 bg-[#F25F4C] text-black py-4 rounded-xl font-bold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(242,95,76,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-95"
                >
                    {isCompleting ? 'Saving...' : 'Complete Review'}
                    {!isCompleting && <ArrowUpRight size={16} />} 
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
