
import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing' | 'billing') => void;
  currentView: string;
  isPro?: boolean;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, isPro, onOpenPricing }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-[60] flex items-start justify-between p-6 pointer-events-none">
      {/* Left: Language Indicator */}
      <div className="pointer-events-auto">
        <div className="flex bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full p-1 h-11 items-center px-2">
           <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="text-xs">🇺🇸</span> EN
           </button>
        </div>
      </div>

      {/* Center: Pill Nav */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
        <nav className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full h-11 px-2 flex items-center gap-1">
           <div className="flex items-center gap-2 px-4 border-r border-white/10 mr-2">
              <div className="w-5 h-5 bg-[#F25F4C] rounded-md flex items-center justify-center">
                 <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-black"></div>
              </div>
              <span className="font-anton text-sm tracking-tight text-white">SCANDO</span>
           </div>
           <div className="flex items-center">
              <button 
                onClick={() => onNavigate('landing')} 
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${currentView === 'landing' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                Workspace
              </button>
              <button 
                onClick={() => onNavigate('calendar')} 
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                Calendar
              </button>
              <button 
                onClick={onOpenPricing} 
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                Pricing
              </button>
           </div>
        </nav>
      </div>

      {/* Right: Mobile Menu Toggle / Hidden on desktop in this style */}
      <div className="md:invisible pointer-events-auto">
         <button className="w-11 h-11 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white">
            <Menu size={20} />
         </button>
      </div>
    </div>
  );
};
