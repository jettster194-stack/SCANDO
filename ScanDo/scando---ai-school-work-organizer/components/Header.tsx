
import React, { useState } from 'react';
import { Layers, Plus, Search, Menu, CalendarDays, X, Home, Clock, User, ArrowLeft, Zap } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing') => void;
  currentView: string;
  isPro?: boolean;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick, onNavigate, currentView, isPro, onOpenPricing }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (view: 'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black border-b border-white/20 text-white transition-all duration-300">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          
          {/* Left: Menu / Search */}
          <div className="flex items-center gap-6">
              <button 
                onClick={toggleMenu}
                className="hover:text-[#F25F4C] transition-colors z-50 relative"
              >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} strokeWidth={2} />}
              </button>
              <div className="hidden sm:flex items-center gap-4 text-sm font-bold tracking-wider">
                  <button 
                    onClick={() => handleNavClick('dashboard')}
                    className={`hover:text-[#F25F4C] transition-colors ${currentView === 'dashboard' ? 'text-[#F25F4C]' : 'text-white'}`}
                  >
                      DASHBOARD
                  </button>
                  <button 
                    onClick={() => handleNavClick('calendar')}
                    className={`hover:text-[#F25F4C] transition-colors ${currentView === 'calendar' ? 'text-[#F25F4C]' : 'text-white'}`}
                  >
                      CALENDAR
                  </button>
              </div>
          </div>

          {/* Center: Brand */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span 
                onClick={() => handleNavClick('landing')}
                className="font-anton text-2xl tracking-wide uppercase select-none cursor-pointer hover:text-[#F25F4C] transition-colors"
              >
                ScanDo
              </span>
          </div>
          
          {/* Right: Actions */}
          <nav className="flex items-center gap-6">
             <button 
              onClick={() => handleNavClick('calendar')}
              className="sm:hidden hover:text-[#F25F4C] transition-colors"
            >
              <CalendarDays size={20} />
            </button>
            
            {/* Pro Badge / Upgrade Button */}
            {isPro ? (
                 <div className="px-2 py-1 bg-[#F25F4C] text-black text-[10px] font-bold rounded uppercase tracking-wider cursor-default">
                    PRO
                 </div>
            ) : (
                <button 
                    onClick={onOpenPricing}
                    className="hidden md:flex px-3 py-1 bg-white/10 hover:bg-[#F25F4C] hover:text-black text-[10px] font-bold rounded uppercase tracking-wider transition-colors items-center gap-1"
                >
                    <Zap size={12} fill="currentColor" /> Upgrade
                </button>
            )}

            <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-anton text-xs">
              M
            </div>
          </nav>
        </div>
      </header>

      {/* --- Sidebar Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={toggleMenu}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative w-80 h-full bg-black border-r border-white/10 shadow-2xl flex flex-col p-8 animate-in slide-in-from-left duration-300">
            
            <div className="mb-12 mt-16 flex items-center gap-4">
              <button 
                onClick={() => handleNavClick('landing')}
                className="font-anton text-4xl tracking-tight uppercase text-white hover:text-[#F25F4C] transition-colors text-left"
              >
                Menu
              </button>
            </div>

            <nav className="flex flex-col gap-6">
               <button 
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-4 text-2xl font-bold transition-colors group ${currentView === 'dashboard' ? 'text-[#F25F4C]' : 'text-white hover:text-[#F25F4C]'}`}
               >
                  <Home size={24} className="group-hover:text-[#F25F4C] transition-colors" />
                  Dashboard
               </button>
               
               <button 
                  onClick={() => handleNavClick('calendar')}
                  className={`flex items-center gap-4 text-2xl font-bold transition-colors group ${currentView === 'calendar' ? 'text-[#F25F4C]' : 'text-white hover:text-[#F25F4C]'}`}
               >
                  <CalendarDays size={24} className="group-hover:text-[#F25F4C] transition-colors" />
                  Schedule
               </button>

               <button 
                  onClick={() => handleNavClick('history')}
                  className={`flex items-center gap-4 text-2xl font-bold transition-colors group ${currentView === 'history' ? 'text-[#F25F4C]' : 'text-white hover:text-[#F25F4C]'}`}
               >
                  <Clock size={24} className="group-hover:text-[#F25F4C] transition-colors" />
                  History
               </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
