import React from 'react';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';

interface SuccessPageProps {
  onContinue: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-700 relative overflow-hidden">
      
      {/* Background Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-2 bg-[#F25F4C] rounded-full animate-float"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.3
                }}
              ></div>
          ))}
      </div>

      <div className="max-w-md w-full text-center relative z-10">
          <div className="w-24 h-24 bg-[#F25F4C] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_#F25F4C] animate-pop-in">
              <Check size={48} className="text-black" strokeWidth={3} />
          </div>

          <h1 className="text-5xl font-anton uppercase mb-4 tracking-tight">Welcome to Pro</h1>
          <p className="text-gray-400 mb-12 text-lg">
              Your account has been upgraded. You now have unlimited scans, deep analysis, and priority support.
          </p>

          <div className="bg-[#111] p-6 rounded-2xl border border-white/10 mb-8 text-left">
              <h3 className="text-xs font-bold text-[#F25F4C] uppercase tracking-widest mb-4">Pro Features Active</h3>
              <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                      <div className="p-1 bg-green-500/20 text-green-500 rounded"><Zap size={14} /></div>
                      <span>Deep Analysis Engine (Gemini Pro)</span>
                  </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-1 bg-blue-500/20 text-blue-500 rounded"><Star size={14} /></div>
                      <span>Unlimited History</span>
                  </div>
              </div>
          </div>

          <button 
            onClick={onContinue}
            className="w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-[#F25F4C] hover:text-black transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
              Go to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    </div>
  );
};