
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Loader2, ScanLine, Shield, Settings, Database, Activity, Terminal, Lock } from 'lucide-react';
import { Header } from './Header';

interface ScannerPageProps {
  onScan: (file: File, mode: 'fast' | 'deep') => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing') => void;
  currentView: string;
  isPro?: boolean;
  onOpenPricing?: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ onScan, onNavigate, currentView, isPro, onOpenPricing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState<'fast' | 'deep'>('fast');
  const [handwriting, setHandwriting] = useState(true);
  const [smartDates, setSmartDates] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartScan = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setTimeout(() => {
        onScan(selectedFile, mode);
    }, 1500);
  };

  const handleSetMode = (newMode: 'fast' | 'deep') => {
      if (newMode === 'deep' && !isPro) {
          if (onOpenPricing) onOpenPricing();
          return;
      }
      setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans relative overflow-hidden perspective-[1000px]">
      
      {/* Use the common Header to provide the collapsible sidebar */}
      <Header 
          onUploadClick={() => {}} // No-op since we are already here
          onNavigate={onNavigate}
          currentView={currentView}
          isPro={isPro}
          onOpenPricing={onOpenPricing}
      />

      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] text-white/5 font-anton text-[25vw] whitespace-nowrap leading-none select-none animate-marquee">
            SCANNING PROCESSING EXTRACTING SCANNING PROCESSING EXTRACTING
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* --- Main Center Content --- */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        
        {/* The Card */}
        <div className="bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-[fadeIn_0.6s_ease-out_forwards] border border-[#F25F4C]/20 relative group">
            
            {/* Inner Content Padding */}
            <div className="p-10 md:p-16 relative z-10">
                
                {/* Header: Icon + Title */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                     <div className="w-16 h-16 bg-[#F25F4C]/10 text-[#F25F4C] rounded-2xl border border-[#F25F4C]/20 shrink-0 flex items-center justify-center">
                        <ScanLine size={36} className="drop-shadow-[0_0_8px_rgba(242,95,76,0.5)]" />
                     </div>
                     <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-anton tracking-tight mb-2">
                           ScanDo Engine
                        </h2>
                        <p className="text-gray-400 text-lg">Upload unstructured documents. Receive actionable JSON tasks.</p>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {/* Left: Processing Mode */}
                    <div className="col-span-2 space-y-8">
                        <div>
                            <p className="text-xs font-bold text-[#F25F4C] mb-4 uppercase tracking-widest flex items-center gap-2 opacity-80">
                                <span className="text-[#F25F4C]">></span> Select Processing Mode
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleSetMode('fast')}
                                    className={`px-6 py-4 text-sm font-mono font-bold rounded-xl transition-all duration-200 border relative overflow-hidden group/btn flex-1 ${
                                        mode === 'fast' 
                                        ? 'bg-[#F25F4C] text-black border-[#F25F4C] shadow-[0_0_20px_rgba(242,95,76,0.3)]' 
                                        : 'bg-transparent text-gray-500 border-gray-800 hover:border-[#F25F4C] hover:text-[#F25F4C]'
                                    }`}
                                >
                                    FAST_SCAN (1.0)
                                </button>
                                <button 
                                    onClick={() => handleSetMode('deep')}
                                    className={`px-6 py-4 text-sm font-mono font-bold rounded-xl transition-all duration-200 border flex-1 relative ${
                                        mode === 'deep' 
                                        ? 'bg-[#F25F4C] text-black border-[#F25F4C] shadow-[0_0_20px_rgba(242,95,76,0.3)]' 
                                        : 'bg-transparent text-gray-500 border-gray-800 hover:border-[#F25F4C] hover:text-[#F25F4C]'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        DEEP_ANALYSIS (2.0)
                                        {!isPro && <Lock size={14} />}
                                    </div>
                                    {!isPro && (
                                        <div className="absolute top-1 right-1">
                                            <div className="w-2 h-2 bg-[#F25F4C] rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                         {/* Input Area */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-base font-bold text-white">
                                    Input Source <span className="font-medium text-gray-500 text-sm ml-2">(PDF, JPG, PNG)</span>
                                </label>
                                {selectedFile && (
                                    <button onClick={() => setSelectedFile(null)} className="text-xs text-red-400 hover:text-red-300 hover:underline font-mono uppercase tracking-wider">
                                        [CLEAR]
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6 h-auto md:h-24">
                                <div 
                                    onClick={() => inputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        flex-1 bg-[#111] border-2 border-dashed rounded-xl flex items-center px-6 py-4 md:py-0 cursor-pointer transition-all duration-200 group relative overflow-hidden
                                        ${isDragging ? 'border-[#F25F4C] bg-[#F25F4C]/5' : 'border-gray-800 hover:border-[#F25F4C] hover:bg-[#F25F4C]/5'}
                                    `}
                                >
                                    <input 
                                        type="file" 
                                        ref={inputRef} 
                                        className="hidden" 
                                        accept="image/*,.pdf" 
                                        onChange={handleFileChange}
                                    />
                                    
                                    {selectedFile ? (
                                        <div className="flex items-center gap-4 w-full text-white font-mono text-sm z-10">
                                            <FileText size={24} className="text-[#F25F4C]" />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate font-bold max-w-[200px]">{selectedFile.name}</span>
                                                <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <div className="ml-auto bg-[#F25F4C]/20 text-[#F25F4C] px-3 py-1 rounded text-xs font-bold border border-[#F25F4C]/30">READY</div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 font-mono text-base group-hover:text-[#F25F4C] transition-colors truncate z-10 flex items-center w-full">
                                            <span className="text-[#F25F4C] animate-pulse font-bold mr-3 text-xl">></span>
                                            Click or drag file...
                                        </div>
                                    )}

                                    {isScanning && (
                                        <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#F25F4C] blur-[6px] animate-[scan-beam_1.5s_ease-in-out_infinite] z-0 shadow-[0_0_20px_#F25F4C]"></div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleStartScan}
                                    disabled={!selectedFile || isScanning}
                                    className={`
                                        h-16 md:h-full px-8 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 min-w-[160px] shadow-lg border uppercase tracking-widest
                                        ${!selectedFile 
                                            ? 'bg-gray-900 text-gray-700 border-gray-800 cursor-not-allowed' 
                                            : isScanning 
                                                ? 'bg-[#F25F4C] text-black border-[#F25F4C] cursor-wait' 
                                                : 'bg-white text-black border-white hover:bg-[#F25F4C] hover:border-[#F25F4C] hover:text-black hover:shadow-[0_0_30px_rgba(242,95,76,0.6)] active:scale-95'
                                        }
                                    `}
                                >
                                    {isScanning ? <Loader2 size={20} className="animate-spin" /> : "Scan"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Configuration Matrix */}
                    <div className="col-span-1 bg-[#111] rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                <Settings size={12} /> Config Matrix
                            </p>
                            <div className="space-y-4">
                                <div 
                                    onClick={() => setHandwriting(!handwriting)}
                                    className="flex items-center justify-between cursor-pointer group"
                                >
                                    <span className={`text-sm font-mono transition-colors ${handwriting ? 'text-white' : 'text-gray-600'}`}>OCR_HANDWRITING</span>
                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${handwriting ? 'bg-[#F25F4C]' : 'bg-gray-800'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${handwriting ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSmartDates(!smartDates)}
                                    className="flex items-center justify-between cursor-pointer group"
                                >
                                    <span className={`text-sm font-mono transition-colors ${smartDates ? 'text-white' : 'text-gray-600'}`}>SMART_DATES_2.0</span>
                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${smartDates ? 'bg-[#F25F4C]' : 'bg-gray-800'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${smartDates ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between cursor-pointer group opacity-50 pointer-events-none">
                                    <span className="text-sm font-mono text-gray-600">AUTO_EXPORT</span>
                                    <div className="w-8 h-4 rounded-full p-0.5 bg-gray-800">
                                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                                <Database size={10} />
                                <span>MODEL: {mode === 'deep' ? 'GEMINI-PRO' : 'GEMINI-3-FLASH'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-2 pt-6 border-t border-white/5">
                    <Shield size={14} className="text-[#F25F4C]" />
                    <span className="font-mono opacity-60">Security Protocol: End-to-end encryption active. Keys are ephemeral.</span>
                </div>
             </div>

             {/* Bottom Progress Bar Decoration */}
             <div className="h-1.5 w-full bg-gray-900 relative">
                 {isScanning && (
                     <div className="absolute inset-0 bg-[#F25F4C] animate-[shimmer_1s_infinite] shadow-[0_0_15px_#F25F4C]"></div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};
