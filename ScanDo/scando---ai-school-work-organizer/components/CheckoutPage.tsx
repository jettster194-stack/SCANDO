
import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, X, CheckCircle2, AlertCircle, Wifi, ExternalLink, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  /**
   * --- BILLING SETUP INSTRUCTIONS ---
   * 
   * 1. Go to https://stripe.com and sign up for an account.
   * 2. In the Stripe Dashboard, go to "Products" -> "Add Product".
   * 3. Name it "ScanDo Pro Subscription" and set the price to $5.00 (Recurring / Monthly).
   * 4. Once created, click "Create Payment Link" for that product.
   * 5. Copy the URL (it starts with https://buy.stripe.com/...).
   * 6. Paste that URL below into the STRIPE_LINK variable.
   */
  
  const STRIPE_LINK = "https://buy.stripe.com/00w4gz3Fkepw4lhaX1bII01"; // <--- PASTE YOUR LINK HERE

  const handleProceedToStripe = () => {
    setIsRedirecting(true);
    // Open in new tab as requested
    window.open(STRIPE_LINK, '_blank');
    
    // Reset loading state after a delay to allow retry if needed
    setTimeout(() => {
        setIsRedirecting(false);
    }, 3000);
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
                        <p className="font-bold text-2xl">$5.00</p>
                        <p className="text-xs text-gray-500">USD</p>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-400">Total Due Today</span>
                    <span className="text-[#F25F4C] text-xl font-bold">$5.00</span>
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
                                        READY_TO_PROCESS
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
                        A new secure checkout tab will open to complete your purchase.
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
                    disabled={isRedirecting}
                    className={`
                        w-full py-5 text-white font-bold text-base uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg
                        ${isRedirecting 
                            ? 'bg-gray-700 cursor-wait' 
                            : 'bg-[#635BFF] hover:bg-[#7a73ff] hover:shadow-[0_0_30px_#635BFF]'
                        }
                    `}
                >
                    {isRedirecting ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> Opening...
                        </>
                    ) : (
                        <>
                            Proceed to Stripe Checkout <ExternalLink size={20} />
                        </>
                    )}
                </button>
                
                <p className="text-center text-[10px] text-gray-600 mt-6 flex items-center justify-center gap-2">
                    <Lock size={10} /> Payments processed securely by Stripe. We do not store your card details.
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};
