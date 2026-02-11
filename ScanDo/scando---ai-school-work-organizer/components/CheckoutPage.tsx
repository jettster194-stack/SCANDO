
import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, X, CheckCircle2, AlertCircle, Wifi, ExternalLink, ArrowRight } from 'lucide-react';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Your specific Stripe Payment Link
  const STRIPE_LINK = "https://buy.stripe.com/3cI14nfo24OW7xte9dbII00";

  const handleProceedToStripe = () => {
    setIsWaitingForPayment(true);
    window.open(STRIPE_LINK, '_blank');
  };

  const handleManualActivation = () => {
      // Manual fallback if redirect fails
      onSuccess();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-500">
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* LEFT COLUMN: Summary & Visuals */}
        <div className="lg:col-span-5 flex flex-col justify-center">
            <button onClick={onBack} className="text-sm text-gray-400 hover:text-white mb-8 flex items-center gap-2 w-fit">
                <X size={16} /> Cancel Upgrade
            </button>

            <h1 className="text-4xl md:text-5xl font-anton uppercase mb-4 text-white leading-none">
                Upgrade to <span className="text-[#F25F4C]">Pro</span>
            </h1>
            <p className="text-gray-400 mb-8">
                Instant access to Gemini Pro Deep Analysis, unlimited storage, and priority support queues.
            </p>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8">
                 <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <div>
                        <p className="font-bold text-lg">ScanDo PRO</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Monthly Plan</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-2xl">$5.99</p>
                        <p className="text-xs text-gray-500">USD</p>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-400">Total Due Today</span>
                    <span className="text-[#F25F4C] text-xl font-bold">$5.99</span>
                </div>
            </div>

            {/* INTERACTIVE 3D CARD (Visual Only) */}
            <div className="relative w-full aspect-[1.586] perspective-1000 group mx-auto max-w-md hidden md:block opacity-80 pointer-events-none">
                <div 
                    className={`
                        w-full h-full relative transition-all duration-700 preserve-3d
                        ${isFlipped ? 'rotate-y-180' : ''}
                    `}
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}
                >
                    {/* FRONT */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between backface-hidden overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start">
                             <Wifi size={24} className="text-gray-500 rotate-90" />
                             <span className="font-bold italic text-white/30 text-lg">SECURE</span>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-8 bg-[#F25F4C] rounded-md flex items-center justify-center shadow-lg">
                                    <div className="w-6 h-4 border border-white/30 rounded-sm"></div>
                                </div>
                                <span className="font-mono text-xl md:text-2xl tracking-widest text-white/50 drop-shadow-md">
                                    •••• •••• •••• ••••
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Status</p>
                                    <p className="font-mono text-sm uppercase tracking-wider text-white truncate max-w-[200px]">
                                        WAITING FOR PAYMENT
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Stripe Redirect Logic */}
        <div className="lg:col-span-7 bg-[#111] rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center">
             
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#F25F4C]/5 blur-[100px] rounded-full pointer-events-none"></div>

             {!isWaitingForPayment ? (
                 <div className="relative z-10 animate-in fade-in slide-in-from-right-10 duration-500">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <ShieldCheck className="text-[#F25F4C]" size={32} />
                        <div>
                            <h2 className="font-bold text-xl uppercase tracking-wider text-white">Secure Checkout</h2>
                            <p className="text-xs text-gray-400">Powered by Stripe Payments</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-gray-300 mb-10">
                        <p className="text-lg leading-relaxed">
                            To ensure the highest level of security, we use Stripe to process all transactions. 
                            You will be redirected to a secure checkout page to complete your purchase.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-[#F25F4C]" />
                                <span>SSL Encrypted Connection</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-[#F25F4C]" />
                                <span>Cancel Anytime</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-[#F25F4C]" />
                                <span>Instant Activation</span>
                            </li>
                        </ul>
                    </div>

                    <button 
                        onClick={handleProceedToStripe}
                        className="w-full py-5 bg-[#635BFF] text-white font-bold text-base uppercase tracking-widest rounded-xl hover:bg-[#7a73ff] hover:shadow-[0_0_30px_#635BFF] transition-all flex items-center justify-center gap-3 shadow-lg"
                    >
                        Proceed to Stripe Checkout <ExternalLink size={20} />
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-600 mt-6 flex items-center justify-center gap-2">
                        <Lock size={10} /> Payments processed securely by Stripe. We do not store your card details.
                    </p>
                 </div>
             ) : (
                 <div className="relative z-10 text-center py-10 animate-in zoom-in-95 duration-500">
                     <div className="w-20 h-20 bg-[#F25F4C]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F25F4C]/30 animate-pulse">
                         <Wifi size={40} className="text-[#F25F4C]" />
                     </div>
                     
                     <h2 className="text-3xl font-anton uppercase mb-4">Complete your payment</h2>
                     <p className="text-gray-400 mb-8 max-w-md mx-auto">
                         We've opened a secure Stripe tab for you. 
                         <br/><br/>
                         <span className="text-white font-bold">Important:</span> After paying, you will be automatically redirected back here to activate your account.
                     </p>

                     <button 
                        onClick={handleManualActivation}
                        className="w-full py-5 border border-white/20 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                    >
                        Override: Activate Manually <ArrowRight size={14} />
                    </button>

                    <button 
                        onClick={() => setIsWaitingForPayment(false)}
                        className="mt-6 text-xs text-gray-500 hover:text-white underline underline-offset-4"
                    >
                        Go back
                    </button>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
