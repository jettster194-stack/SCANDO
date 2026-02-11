
import React, { useState } from 'react';
import { 
  Zap, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle,
  Receipt,
  ArrowUpRight,
  Loader2,
  Trophy
} from 'lucide-react';

interface BillingPageProps {
  isPro: boolean;
  onBack: () => void;
  onCancelPro: () => void;
  onUpgrade: () => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ isPro, onBack, onCancelPro, onUpgrade }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleCancelClick = () => {
    setIsCancelling(true);
    setTimeout(() => {
      onCancelPro();
      setIsCancelling(false);
      setShowConfirmCancel(false);
    }, 1500);
  };

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onUpgrade();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/20 pb-8 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-5xl md:text-7xl font-anton uppercase tracking-tighter leading-none text-white">Subscription</h1>
          <p className="font-mono text-sm text-[#F25F4C] uppercase tracking-widest mt-2">
            Account Management & Billing
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full border font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${isPro ? 'bg-[#F25F4C]/10 border-[#F25F4C] text-[#F25F4C]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
            Status: {isPro ? 'Active Pro' : 'Free Tier'}
            {isPro && <Zap size={14} fill="currentColor" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Plan Details */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-[#111] rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap size={160} />
            </div>
            
            <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              Current Plan
            </h3>

            <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
              <div className="space-y-1">
                <p className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest">Selected Tier</p>
                <h4 className="text-4xl font-anton uppercase">{isPro ? 'ScanDo Pro' : 'Starter Free'}</h4>
                <p className="text-gray-500 text-sm">{isPro ? '$5.00 / month' : '$0.00 / forever'}</p>
              </div>
              
              <div className="flex flex-col justify-center">
                {isPro ? (
                  <button 
                    onClick={() => setShowConfirmCancel(true)}
                    className="px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button 
                    onClick={handleUpgradeClick}
                    className="px-8 py-4 bg-[#F25F4C] text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(242,95,76,0.3)] border border-[#F25F4C]"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#F25F4C] mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Unlimited Scans</p>
                  <p className="text-xs text-gray-500">Process as many docs as you need.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#F25F4C] mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Deep Analysis</p>
                  <p className="text-xs text-gray-500">Gemini Pro reasoning engine enabled.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transaction History */}
          <section>
            <h3 className="text-white text-xl font-bold mb-6 px-2 flex items-center gap-3">
              <Receipt size={20} className="text-gray-500" /> Payment History
            </h3>
            <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isPro ? (
                    <tr>
                      <td className="px-6 py-4 font-mono">{new Date().toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-gray-300">ScanDo Pro Monthly</td>
                      <td className="px-6 py-4">$5.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold">PAID</span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-600 font-mono text-xs">
                        NO_TRANSACTIONS_FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: Sidebar Info */}
        <div className="lg:col-span-5 space-y-8">
           {isPro ? (
             <>
                <div className="bg-[#111] rounded-3xl p-8 border border-white/10 animate-in slide-in-from-right-10 duration-500">
                  <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Security & Privacy
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Your payment information is processed by <span className="text-white font-bold">Stripe</span>. ScanDo does not store your credit card details on our servers.
                  </p>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 bg-[#F25F4C]/10 text-[#F25F4C] rounded-lg flex items-center justify-center shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold uppercase tracking-wider text-white">Default Method</p>
                      <p className="text-xs text-gray-500 truncate">Visa ending in •••• 4242</p>
                    </div>
                    <button className="ml-auto text-[#F25F4C] hover:text-white transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#111] to-black rounded-3xl p-8 border border-white/10 animate-in slide-in-from-right-10 duration-700">
                  <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Automatic Renewal
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your subscription will automatically renew on <span className="text-white font-bold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span> unless cancelled before then.
                  </p>
                </div>
             </>
           ) : (
             <div className="bg-[#111] rounded-3xl p-8 border border-white/10 text-center space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="w-16 h-16 bg-[#F25F4C]/10 text-[#F25F4C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade for More</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unlock deep reasoning, unlimited storage, and advanced planning features by joining Pro.
                  </p>
                </div>
                <button 
                  onClick={handleUpgradeClick}
                  className="w-full py-3 bg-white/5 hover:bg-[#F25F4C] hover:text-black border border-white/10 hover:border-[#F25F4C] rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-white"
                >
                  See Pro Features
                </button>
             </div>
           )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#111] border border-red-500/30 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-anton uppercase text-white mb-4">Wait!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Cancelling your subscription will remove access to the Gemini Pro reasoning engine and unlimited storage. Are you sure you want to proceed?
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleCancelClick}
                disabled={isCancelling}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
              >
                {isCancelling ? <Loader2 className="animate-spin" size={20} /> : "Yes, Cancel Pro"}
              </button>
              <button 
                onClick={() => setShowConfirmCancel(false)}
                className="w-full py-4 border border-white/10 text-gray-500 font-bold rounded-xl uppercase tracking-widest text-sm hover:text-white hover:border-white transition-all"
              >
                Keep My Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
