import React, { useState, useEffect } from 'react';
import { ScannedDocument, TaskItem, Priority } from '../types';
import { ChevronLeft, ChevronRight, Bell, BellRing, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface CalendarPageProps {
  documents: ScannedDocument[];
  onToggleTask: (docId: string, taskId: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ documents, onToggleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasRequestedNotifs, setHasRequestedNotifs] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Extract all tasks and flatten
  const allTasks = documents.flatMap(doc => 
    doc.tasks.map(t => ({ ...t, docId: doc.id, docTitle: doc.title }))
  );

  // Get tasks for selected date
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allTasks.filter(task => task.dueDate === dateStr);
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);
  const todaysTasks = getTasksForDate(new Date());

  // Notification Logic
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        setHasRequestedNotifs(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        setNotificationsEnabled(true);
        // Test notification
        if (todaysTasks.length > 0) {
            new Notification('ScanDo Tasks Due Today', {
                body: `You have ${todaysTasks.length} tasks due today.`,
                icon: '/favicon.ico'
            });
        }
    }
    setHasRequestedNotifs(true);
  };

  // Calendar Grid Generation
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

  const renderCalendarDays = () => {
    const days = [];
    // Padding for empty start days with borders
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(
            <div key={`empty-${i}`} className="h-24 sm:h-32 border-r border-b border-black/20 bg-[#F25F4C]" />
        );
    }

    // Actual Days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const isSelected = selectedDate.toDateString() === date.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();
        
        const dayTasks = allTasks.filter(t => t.dueDate === dateStr);
        const hasHighPriority = dayTasks.some(t => t.priority === Priority.High && !t.isCompleted);
        const taskCount = dayTasks.length;

        days.push(
            <div 
                key={day} 
                onClick={() => setSelectedDate(date)}
                className={`
                    relative h-24 sm:h-32 border-r border-b border-black/20 flex flex-col items-start justify-start p-2 cursor-pointer transition-all duration-200 group
                    ${isSelected ? 'bg-black text-white shadow-inner' : 'hover:bg-black/5 text-black bg-[#F25F4C]'}
                `}
            >
                <div className="w-full flex justify-between items-start">
                    <span className={`
                        text-lg font-bold font-mono w-8 h-8 flex items-center justify-center rounded-full
                        ${isToday && !isSelected ? 'bg-white text-black' : ''}
                        ${isSelected ? 'text-white' : ''}
                    `}>
                        {day}
                    </span>
                    
                    {/* Corner High Priority Indicator */}
                    {hasHighPriority && !isSelected && (
                         <AlertCircle size={14} className="text-black/50" />
                    )}
                </div>

                {/* Task Content Preview */}
                <div className="mt-auto w-full space-y-1">
                    {taskCount > 0 && (
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-full truncate ${isSelected ? 'bg-[#F25F4C] text-black' : 'bg-black/10 text-black'}`}>
                            {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
                        </div>
                    )}
                    {/* Show first task snippet if space allows */}
                    {taskCount > 0 && (
                         <p className={`hidden sm:block text-[9px] truncate opacity-60 pl-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                             {dayTasks[0].description}
                         </p>
                    )}
                </div>
            </div>
        );
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    setSlideDirection(delta > 0 ? 'right' : 'left');
    // Allow React to process the state change slightly before switching content for smoother feel
    // Or just change immediately and let CSS animation handle entrance
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black text-white p-4 sm:p-12 animate-in fade-in duration-500">
        
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-12">
            
            {/* LEFT COLUMN: Calendar Widget (Takes up more space now) */}
            <div className="xl:col-span-3">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-5xl font-anton uppercase tracking-tight">Schedule</h1>
                        <p className="text-[#F25F4C] font-mono text-sm uppercase tracking-widest mt-1">
                            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => changeMonth(-1)}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F25F4C] hover:border-[#F25F4C] hover:text-black transition-colors active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => changeMonth(1)}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F25F4C] hover:border-[#F25F4C] hover:text-black transition-colors active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* THE ORANGE CALENDAR BOX */}
                <div className="bg-[#F25F4C] rounded-[2rem] p-6 sm:p-8 shadow-[0_0_60px_rgba(242,95,76,0.1)] relative overflow-hidden">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-black/20">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                            <div key={i} className="text-left pl-2 font-bold text-black/40 text-xs uppercase tracking-widest py-3 border-r border-black/20 last:border-r-0">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid - No Gaps, using Borders */}
                    {/* KEY is vital for triggering the animation on month change */}
                    <div 
                        key={currentDate.toISOString()}
                        className={`
                            grid grid-cols-7 border-l border-t border-black/20
                            ${slideDirection === 'right' ? 'animate-slide-right' : ''}
                            ${slideDirection === 'left' ? 'animate-slide-left' : ''}
                            ${!slideDirection ? 'animate-in fade-in' : ''}
                        `}
                    >
                        {renderCalendarDays()}
                    </div>
                </div>

                {/* Notification Prompt */}
                {!notificationsEnabled && !hasRequestedNotifs && (
                    <div className="mt-6 flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl border border-white/10 max-w-xl animate-pop-in">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F25F4C]/20 text-[#F25F4C] flex items-center justify-center">
                                <BellRing size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Enable Deadline Alerts</h4>
                                <p className="text-xs text-gray-400">Get notified on your device when high priority tasks are due.</p>
                            </div>
                        </div>
                        <button 
                            onClick={requestNotificationPermission}
                            className="px-4 py-2 bg-[#F25F4C] text-black text-xs font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-wider"
                        >
                            Enable
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Task List for Selected Date */}
            <div className="xl:col-span-1 flex flex-col h-full xl:pl-4 xl:border-l border-white/10">
                <div className="mb-8">
                    <h2 className="text-2xl font-anton uppercase tracking-tight text-white/50">
                        {selectedDate.toLocaleDateString('default', { weekday: 'long' })}
                    </h2>
                    <h3 className="text-6xl font-anton uppercase tracking-tighter text-white">
                        {selectedDate.getDate()} {selectedDate.toLocaleDateString('default', { month: 'short' })}
                    </h3>
                </div>

                <div className="flex-1 bg-[#111] rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F25F4C] to-transparent"></div>
                    
                    <h4 className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Circle size={8} className="fill-[#F25F4C]" />
                        Daily Agenda
                    </h4>

                    {tasksForSelectedDate.length > 0 ? (
                        <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
                            {tasksForSelectedDate.map((task, idx) => (
                                <div 
                                    key={`${task.docId}-${task.id}`}
                                    className="group animate-pop-in"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div 
                                        onClick={() => onToggleTask(task.docId, task.id)}
                                        className="flex gap-4 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <div className={`mt-1 ${task.isCompleted ? 'text-[#F25F4C]' : 'text-gray-500 group-hover:text-white'}`}>
                                            {task.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium leading-tight ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                {task.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono bg-white/5 px-2 py-0.5 rounded">
                                                    {task.category || 'General'}
                                                </span>
                                                {task.priority === Priority.High && (
                                                    <span className="text-[10px] text-[#F25F4C] uppercase tracking-wider font-bold flex items-center gap-1">
                                                        <AlertCircle size={10} /> Urgent
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {idx < tasksForSelectedDate.length - 1 && (
                                        <div className="h-px bg-white/5 mx-3 mt-4"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} className="text-white/50" />
                            </div>
                            <p className="font-mono text-sm uppercase tracking-widest text-[#F25F4C]">No tasks due</p>
                            <p className="text-xs text-gray-500 mt-2 max-w-[200px]">
                                Your schedule is clear for this date.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};