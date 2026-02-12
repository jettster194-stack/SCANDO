
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Receipt, 
  StickyNote, 
  FileText, 
  Plus,
  LayoutGrid,
  Zap,
  BrainCircuit,
  CalendarClock,
  ArrowRight,
  ChevronDown,
  Scan,
  Maximize2,
  Database,
  Cpu,
  Layers,
  Search,
  ZapOff,
  Terminal,
  Lock
} from 'lucide-react';
import { Header } from './components/Header';
import { ScannerPage } from './components/ScannerPage';
import { TaskCard } from './components/TaskCard';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CalendarPage } from './components/CalendarPage';
import { HistoryPage } from './components/HistoryPage';
import { PricingPage } from './components/PricingPage';
import { CheckoutPage } from './components/CheckoutPage';
import { SuccessPage } from './components/SuccessPage';
import { StudyPlanPage } from './components/StudyPlanPage';
import { BillingPage } from './components/BillingPage';
import { SettingsPage } from './components/SettingsPage';
import { FileUpload } from './components/FileUpload';
import { analyzeDocument } from './services/geminiService';
import { ScannedDocument, Priority } from './types';

export const App = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing' | 'checkout' | 'success' | 'studyPlan' | 'billing' | 'settings'>('landing');
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showScanPage, setShowScanPage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        setIsPro(true);
        localStorage.setItem('scando_pro', 'true');
        setView('success');
        window.history.replaceState({}, '', window.location.pathname);
    }
    const savedDocs = localStorage.getItem('scando_docs');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) { console.error(e); }
    }
    if (localStorage.getItem('scando_pro') === 'true') setIsPro(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('scando_docs', JSON.stringify(documents));
  }, [documents]);

  const handleScan = async (file: File, mode: 'fast' | 'deep') => {
    const tempId = Date.now().toString();
    const tempDoc: ScannedDocument = {
      id: tempId,
      title: 'Processing...',
      summary: 'Extracting data...',
      originalFileUrl: URL.createObjectURL(file),
      fileType: file.type.includes('pdf') ? 'pdf' : 'image',
      tasks: [],
      createdAt: Date.now(),
      status: 'processing'
    };
    setDocuments(prev => [tempDoc, ...prev]);
    setView('dashboard');
    setShowScanPage(false);
    try {
      const analysis = await analyzeDocument(file, mode);
      setDocuments(prev => prev.map(doc => doc.id === tempId ? {
        ...doc,
        title: analysis.title,
        summary: analysis.summary,
        tasks: analysis.tasks.map((t, idx) => ({
          id: `${tempId}-${idx}`,
          description: t.description,
          priority: t.priority as Priority,
          isCompleted: false,
          category: t.category,
          dueDate: t.dueDate
        })),
        studyPlan: analysis.studyPlan,
        status: 'completed'
      } : doc));
    } catch (error) {
      console.error("Scan Failed:", error);
      setDocuments(prev => prev.map(doc => doc.id === tempId ? { ...doc, status: 'error', summary: 'Failed to process.' } : doc));
    }
  };

  const handleToggleTask = (docId: string, taskId: string) => {
    setDocuments(prev => prev.map(doc => doc.id === docId ? {
      ...doc,
      tasks: doc.tasks.map(task => task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task)
    } : doc));
  };

  const handleUpdatePriority = (docId: string, taskId: string, newPriority: Priority) => {
    setDocuments(prev => prev.map(doc => doc.id === docId ? {
      ...doc,
      tasks: doc.tasks.map(task => task.id === taskId ? { ...task, priority: newPriority } : task)
    } : doc));
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (selectedDocId === docId) setSelectedDocId(null);
  };

  const renderContent = () => {
    if (showScanPage) {
      return (
        <ScannerPage 
          onScan={handleScan}
          onNavigate={(v) => { setShowScanPage(false); setView(v as any); }}
          currentView="scanner"
          isPro={isPro}
          onOpenPricing={() => { setShowScanPage(false); setView('pricing'); }}
        />
      );
    }

    switch (view) {
      case 'landing':
        return (
          <div className="flex flex-col min-h-screen bg-black overflow-hidden selection:bg-[#F25F4C] selection:text-black scroll-smooth">
              <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="landing" isPro={isPro} onOpenPricing={() => setView('pricing')} />

              {/* NAKA.COM INSPIRED HERO - REFINED */}
              <main className="relative flex flex-col items-center justify-center min-h-screen pb-12">
                  
                  {/* Grid Background */}
                  <div className="absolute inset-0 grid-bg opacity-30 z-0"></div>
                  
                  {/* High-End Scan Line Animation */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                      <div className="scan-beam"></div>
                  </div>

                  {/* LARGE BACKGROUND TYPOGRAPHY - Pushed Further Back */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden">
                      <div className="relative transform scale-110 md:scale-100">
                          <h1 className="font-anton text-[40vw] leading-[0.7] text-white opacity-[0.02] select-none tracking-tighter uppercase whitespace-nowrap">
                            SCAN
                          </h1>
                          <h1 className="font-anton text-[40vw] leading-[0.7] text-white opacity-[0.02] select-none tracking-tighter uppercase whitespace-nowrap mt-[-10vw]">
                            DO
                          </h1>
                      </div>
                  </div>

                  {/* CENTER PIECE: THE AI ENGINE */}
                  <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 pt-20">
                      
                      {/* Left Content Column */}
                      <div className="flex-1 space-y-10 text-left max-w-2xl">
                          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
                              <div className="h-[1px] w-12 bg-[#F25F4C]"></div>
                              <span className="font-mono text-[#F25F4C] text-[10px] uppercase tracking-[0.5em] font-bold">DIGITAL CRAFT // AI ENGINE</span>
                          </div>
                          
                          <h2 className="text-6xl md:text-8xl xl:text-9xl font-anton uppercase leading-[0.85] tracking-tighter text-white animate-in fade-in slide-in-from-left duration-700 delay-100">
                             Precision <br/>
                             <span className="text-[#F25F4C]">Extraction.</span>
                          </h2>
                          
                          {/* HERO METRICS - Better Spacing & Clarity */}
                          <div className="flex gap-12 py-4 animate-in fade-in duration-1000 delay-300">
                              <div className="space-y-1">
                                  <p className="font-anton text-4xl text-white">0.8s</p>
                                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Extraction Speed</p>
                              </div>
                              <div className="h-12 w-px bg-white/10"></div>
                              <div className="space-y-1">
                                  <p className="font-anton text-4xl text-white">99%</p>
                                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">OCR Accuracy</p>
                              </div>
                          </div>
                          
                          <p className="text-gray-400 font-medium text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-left duration-700 delay-200 border-l border-white/10 pl-8">
                             We engineer the success of your studies through high-fidelity task extraction and strategic execution plans powered by Gemini.
                          </p>
                      </div>

                      {/* Right: The "Eye" / Abstract 3D shape */}
                      <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                          {/* Animated Rings */}
                          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_25s_linear_infinite]"></div>
                          <div className="absolute inset-8 border border-[#F25F4C]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                          <div className="absolute inset-20 border border-white/5 rounded-full animate-[spin_15s_linear_infinite]"></div>
                          
                          {/* The Core */}
                          <div className="relative w-48 h-48 md:w-64 md:h-64 bg-black border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(242,95,76,0.15)] group overflow-hidden animate-float-subtle">
                              <div className="absolute inset-0 bg-[#F25F4C]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <Scan size={90} className="text-[#F25F4C] group-hover:scale-110 transition-transform duration-500" />
                              
                              {/* Glowing Scan Line over the icon */}
                              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#F25F4C] shadow-[0_0_15px_#F25F4C] animate-[scan-vertical_4s_ease-in-out_infinite]"></div>
                          </div>

                          {/* Tech Corner Details */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#F25F4C]/40"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#F25F4C]/40"></div>
                      </div>
                  </div>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                      <ChevronDown size={32} />
                  </div>
              </main>

              {/* INFO SECTION: THE CORE TECHNOLOGY */}
              <section className="relative z-10 bg-black py-32 md:py-48 px-6 border-t border-white/5">
                  <div className="max-w-7xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                          <div className="space-y-12">
                              <div className="space-y-4">
                                  <p className="font-mono text-[#F25F4C] text-[10px] uppercase tracking-[0.5em] font-bold">OPERATIONAL CORE</p>
                                  <h2 className="text-5xl md:text-7xl font-anton uppercase leading-[0.9] text-white">How we <br/><span className="text-[#F25F4C]">Engineer</span> your time.</h2>
                              </div>
                              <p className="text-gray-500 text-lg md:text-xl max-w-xl leading-relaxed">
                                  ScanDo isn't a to-do list. It's an extraction engine designed to bridge the gap between static information and actionable digital workflows.
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#F25F4C]">
                                          <Cpu size={24} />
                                      </div>
                                      <h4 className="font-anton text-xl uppercase text-white">Multimodal OCR</h4>
                                      <p className="text-gray-500 text-sm leading-relaxed">Our proprietary OCR layer recognizes handwriting, printed text, and UI screenshots with near-perfect fidelity.</p>
                                  </div>
                                  <div className="space-y-4">
                                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#F25F4C]">
                                          <BrainCircuit size={24} />
                                      </div>
                                      <h4 className="font-anton text-xl uppercase text-white">Deep Reasoning</h4>
                                      <p className="text-gray-500 text-sm leading-relaxed">Gemini 3 Pro analyzes context to infer priorities, categories, and due dates even when they aren't explicit.</p>
                                  </div>
                              </div>
                          </div>

                          <div className="relative">
                               <div className="aspect-square rounded-[3rem] bg-[#0A0A0A] border border-white/5 p-12 flex flex-col justify-between group overflow-hidden">
                                   <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
                                   <div className="space-y-8 relative z-10">
                                       <div className="flex items-center gap-4 text-white/20 font-mono text-xs">
                                           {/* Added missing Terminal icon */}
                                           <Terminal size={14} />
                                           <span>PROCESS_LOG::0x42A</span>
                                       </div>
                                       <div className="space-y-4">
                                           <div className="h-4 w-3/4 bg-[#F25F4C]/20 rounded-full animate-pulse"></div>
                                           <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                                           <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                                       </div>
                                       <div className="pt-8 border-t border-white/10">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-gray-400 font-mono text-[10px] uppercase">Task Detected</span>
                                                <span className="text-[#F25F4C] font-mono text-[10px]">99.4% CONFIDENCE</span>
                                            </div>
                                            <div className="bg-black p-4 rounded-xl border border-[#F25F4C]/30 flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full border border-[#F25F4C]"></div>
                                                <span className="text-white text-xs font-mono uppercase">Review Chapter 4 Physics PR</span>
                                            </div>
                                       </div>
                                   </div>
                                   <div className="relative z-10 pt-12 flex items-center gap-6">
                                       <Layers className="text-[#F25F4C]" size={40} />
                                       <div className="h-px flex-1 bg-white/10"></div>
                                       <Database className="text-white/20" size={40} />
                                   </div>
                               </div>
                               {/* Tech accent floating */}
                               <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F25F4C]/10 blur-3xl rounded-full"></div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* CALL TO ACTION SECTION */}
              <section className="relative bg-black py-32 md:py-64 px-6 overflow-hidden">
                  <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                      <p className="font-mono text-[#F25F4C] text-[10px] uppercase tracking-[0.5em] font-bold mb-10">TERMINATE CHAOS</p>
                      
                      <h2 className="text-7xl md:text-9xl font-anton uppercase leading-[0.8] text-white tracking-tighter mb-16">
                          Ready to <br/><span className="text-[#F25F4C]">Engineer</span> Success?
                      </h2>
                      
                      <button 
                        onClick={() => setShowScanPage(true)}
                        className="group relative bg-[#F25F4C] text-black px-16 py-10 md:px-32 md:py-14 flex flex-col items-start gap-4 transition-all hover:bg-white hover:shadow-[0_0_100px_rgba(242,95,76,0.3)] active:scale-95"
                      >
                          <div className="flex justify-between w-full items-center gap-16 md:gap-32">
                            <span className="font-anton text-6xl md:text-8xl uppercase tracking-tighter leading-none">JOIN</span>
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-black/20 flex items-center justify-center group-hover:border-black transition-colors">
                                <ArrowRight size={50} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                          <div className="w-full flex justify-between items-center opacity-40 font-mono text-[10px] font-bold uppercase tracking-widest mt-6">
                              <span>INITIALIZE WORKSPACE</span>
                              <span>STABLE V.2.4.1</span>
                          </div>
                      </button>
                      
                      <div className="mt-20 flex gap-12 text-gray-500 font-mono text-[10px] uppercase tracking-widest border-t border-white/5 pt-10 w-full max-w-xl justify-center">
                          {/* Added missing Lock icon */}
                          <span className="flex items-center gap-2"><Lock size={12} /> SECURE</span>
                          <span className="flex items-center gap-2"><Zap size={12} /> INSTANT</span>
                          <span className="flex items-center gap-2"><Maximize2 size={12} /> SCALABLE</span>
                      </div>
                  </div>
                  
                  {/* Decorative background logo */}
                  <div className="absolute bottom-[-10vw] left-[-5vw] pointer-events-none opacity-5">
                      <h1 className="font-anton text-[30vw] text-white select-none">DO</h1>
                  </div>
              </section>

              {/* FOOTER STRIP */}
              <footer className="bg-black py-12 px-6 border-t border-white/5 text-center">
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-[#F25F4C] rounded-md flex items-center justify-center">
                             <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-black"></div>
                          </div>
                          <span className="font-anton text-xl tracking-tight text-white uppercase">SCANDO.AI</span>
                      </div>
                      <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.2em]">© 2025 ScanDo Systems // All Rights Reserved</p>
                      <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <a href="#" className="hover:text-white transition-colors">Terms</a>
                          <a href="#" className="hover:text-white transition-colors">Privacy</a>
                          <a href="#" className="hover:text-white transition-colors">Contact</a>
                      </div>
                  </div>
              </footer>
          </div>
        );

      case 'dashboard':
        return (
          <div className="min-h-screen bg-black flex flex-col">
             <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="dashboard" isPro={isPro} onOpenPricing={() => setView('pricing')} />
              <div className="flex-1 p-6 md:p-12 max-w-[1600px] mx-auto w-full mt-16">
                  <div className="flex items-end justify-between mb-8 md:mb-12">
                      <div>
                          <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">Dashboard</h2>
                          <p className="text-[#F25F4C] font-mono text-sm uppercase tracking-widest">Active Workspace</p>
                      </div>
                      <button onClick={() => setShowScanPage(true)} className="hidden md:flex bg-[#F25F4C] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider items-center gap-2 hover:bg-white transition-colors">
                          <Plus size={20} /> New Scan
                      </button>
                  </div>
                  {documents.length === 0 ? (
                      <div className="w-full h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-[#111] gap-6">
                          <LayoutGrid size={40} className="text-gray-500" />
                          <div className="text-center">
                              <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
                              <p className="text-gray-500 max-w-sm mx-auto">Upload a screenshot, receipt, or handwritten note to extract tasks.</p>
                          </div>
                          <button onClick={() => setShowScanPage(true)} className="text-[#F25F4C] hover:text-white font-mono text-sm uppercase tracking-wider font-bold">Start Scanning</button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {documents.map((doc, idx) => (
                              <TaskCard key={doc.id} document={doc} onClick={() => setSelectedDocId(doc.id)} index={idx} />
                          ))}
                      </div>
                  )}
              </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="min-h-screen bg-black flex flex-col">
              <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="calendar" isPro={isPro} onOpenPricing={() => setView('pricing')} />
              <div className="mt-16"><CalendarPage documents={documents} onToggleTask={handleToggleTask} /></div>
          </div>
        );

      case 'history':
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="history" isPro={isPro} onOpenPricing={() => setView('pricing')} />
              <div className="mt-16"><HistoryPage documents={documents} onSelectDocument={(id) => setSelectedDocId(id)} onBack={() => setView('dashboard')} /></div>
           </div>
        );

      case 'settings':
        return (
          <div className="min-h-screen bg-black flex flex-col">
             <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="settings" isPro={isPro} onOpenPricing={() => setView('pricing')} />
             <div className="mt-16"><SettingsPage onBack={() => setView('dashboard')} onClearData={() => setDocuments([])} /></div>
          </div>
        );

      case 'pricing':
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="pricing" isPro={isPro} onOpenPricing={() => {}} />
              <div className="mt-16"><PricingPage onBack={() => setView('dashboard')} onGoToCheckout={() => setView('checkout')} /></div>
           </div>
        );

      case 'checkout':
        return <div className="min-h-screen bg-black flex flex-col"><CheckoutPage onBack={() => setView('pricing')} onSuccess={() => { setIsPro(true); setView('success'); }} /></div>;
      case 'success':
        return <SuccessPage onContinue={() => setView('dashboard')} />;
      case 'studyPlan':
        const docForPlan = documents.find(d => d.id === selectedDocId);
        if (!isPro) { setView('pricing'); return null; }
        if (!docForPlan) { setView('dashboard'); return null; }
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="dashboard" isPro={isPro} onOpenPricing={() => setView('pricing')} />
              <div className="mt-16"><StudyPlanPage document={docForPlan} onBack={() => { setView('dashboard'); setSelectedDocId(docForPlan.id); }} /></div>
           </div>
        );
      case 'billing':
        return (
          <div className="min-h-screen bg-black flex flex-col">
             <Header onUploadClick={() => setShowScanPage(true)} onNavigate={setView} currentView="billing" isPro={isPro} onOpenPricing={() => setView('pricing')} />
             <div className="mt-16"><BillingPage isPro={isPro} onBack={() => setView('dashboard')} onCancelPro={() => setIsPro(false)} onUpgrade={() => setView('pricing')} /></div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="text-white font-sans selection:bg-[#F25F4C] selection:text-black">
      {renderContent()}
      {selectedDocId && view !== 'studyPlan' && view !== 'billing' && view !== 'settings' && (
        <TaskDetailModal 
          document={documents.find(d => d.id === selectedDocId)!} 
          onClose={() => setSelectedDocId(null)}
          onToggleTask={handleToggleTask}
          onUpdatePriority={handleUpdatePriority}
          onDelete={handleDelete}
          onViewStudyPlan={(id) => { if (isPro) { setSelectedDocId(id); setView('studyPlan'); } else setView('pricing'); }}
          isPro={isPro}
        />
      )}
      {isUploadOpen && <FileUpload onFileSelect={(file) => { handleScan(file, 'fast'); setIsUploadOpen(false); }} onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
};
