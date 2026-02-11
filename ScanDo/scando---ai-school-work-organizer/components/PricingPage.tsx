
import React from 'react';
import { CheckCircle2, Zap, Shield, Database, Infinity, BrainCircuit, X } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onGoToCheckout: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onGoToCheckout }) => {
  
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-in fade-in duration-500 min-h-screen">
        <div className="flex items-end justify-between mb-16 border-b border-white/20 pb-4">
            <div>
                <h1 className="text-6xl font-anton uppercase tracking-tighter leading-none mb-2 text-white">Upgrade</h1>
                <p className="font-mono text-sm text-[#F25F4C] uppercase tracking-widest">
                    Unlock Full Potential
                </p>
            </div>
            <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2">
                <X size={20} /> Close
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* FREE PLAN */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#111] flex flex-col relative group hover:border-white/20 transition-colors">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-anton text-white">$0</span>
                        <span className="text-gray-500">/ forever</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                        Perfect for casual organization and testing the engine. Experience the power of AI extraction with daily limits.
                    </p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                    <FeatureItem text="3 Scans per day" />
                    <FeatureItem text="Fast Scan Mode (Standard Model)" />
                    <FeatureItem text="7-Day History Retention" />
                    <FeatureItem text="Basic Task Extraction" />
                    <FeatureItem text="Local Storage Only" />
                </div>

                <button 
                    onClick={onBack}
                    className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm"
                >
                    Continue Free
                </button>
            </div>

            {/* PRO PLAN */}
            <div className="p-8 rounded-3xl border-2 border-[#F25F4C] bg-[#0a0a0a] flex flex-col relative shadow-[0_0_50px_rgba(242,95,76,0.1)] transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-[#F25F4C] text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                    Most Popular
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#F25F4C] mb-2">ScanDo PRO</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-anton text-white">$5.00</span>
                        <span className="text-gray-500">/ month</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                        For power users who need deep insights, unlimited history, and precision control.
                    </p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                    <FeatureItem text="Unlimited Scans" highlighted />
                    <FeatureItem text="Deep Analysis Mode (Gemini Pro)" highlighted icon={<BrainCircuit size={16} />} />
                    <FeatureItem text="Unlimited History Retention" icon={<Infinity size={16} />} />
                    <FeatureItem text="Smart Date & Category Inference" />
                    <FeatureItem text="Export to Notion & JSON" icon={<Database size={16} />} />
                    <FeatureItem text="Priority Processing Queue" icon={<Zap size={16} />} />
                </div>

                <button 
                    onClick={onGoToCheckout}
                    className="w-full py-4 rounded-xl bg-[#F25F4C] text-black font-bold hover:bg-white hover:shadow-[0_0_30px_rgba(242,95,76,0.5)] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                    Upgrade Now <Zap size={16} fill="currentColor" />
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-4">
                    Secure payment via Stripe. Cancel anytime.
                </p>
            </div>

        </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string; highlighted?: boolean; icon?: React.ReactNode }> = ({ text, highlighted, icon }) => (
    <div className="flex items-center gap-3">
        <div className={`mt-0.5 ${highlighted ? 'text-[#F25F4C]' : 'text-gray-500'}`}>
            {icon || <CheckCircle2 size={18} />}
        </div>
        <span className={`text-sm ${highlighted ? 'text-white font-medium' : 'text-gray-400'}`}>{text}</span>
    </div>
);
