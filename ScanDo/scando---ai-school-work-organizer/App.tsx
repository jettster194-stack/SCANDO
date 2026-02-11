
import React, { useState, useEffect } from 'react';
import { 
  Signal, 
  Battery, 
  CheckSquare, 
  Receipt, 
  StickyNote, 
  FileText, 
  Plus,
  LayoutGrid,
  Zap,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Target,
  Layers,
  Infinity,
  Database,
  ScanLine,
  ChevronDown
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
import { FileUpload } from './components/FileUpload';
import { analyzeDocument } from './services/geminiService';
import { ScannedDocument, Priority, TaskItem } from './types';

// Mock Data for Landing Carousel
const CAROUSEL_ITEMS = [
  {
    type: 'RECEIPT',
    label: 'Receipt Scan',
    icon: <Receipt size={10} />,
    style: 'bg-gray-100 text-black',
    content: {
      header: 'Whole Foods Market',
      subject: 'Total: $142.50',
      body: 'Milk, Eggs, Avocado, Sourdough, Coffee Beans...'
    },
    tasks: [{ text: 'Split cost with roommates' }, { text: 'Log in budget app' }]
  },
  {
    type: 'NOTE',
    label: 'Meeting Notes',
    icon: <StickyNote size={10} />,
    style: 'bg-yellow-50 text-gray-800',
    content: {
      header: 'Q4 Strategy',
      subject: 'Team Sync',
      body: '- Launch new landing page\n- Update pricing tier\n- Email campaign'
    },
    tasks: [{ text: 'Draft landing page copy' }, { text: 'Update Stripe prices' }]
  },
  {
    type: 'MESSAGE',
    label: 'Screenshot',
    icon: <FileText size={10} />,
    style: 'bg-blue-50 text-blue-900',
    content: {
      header: 'Slack Message',
      subject: 'From: Sarah',
      body: 'Can you review the PR by 3pm? Also need the design assets.'
    },
    tasks: [{ text: 'Review PR #402' }, { text: 'Send assets to Sarah' }]
  },
  {
    type: 'NOTE',
    label: 'Notebook',
    icon: <FileText size={10} />,
    style: 'bg-white text-gray-900',
    content: {
      header: 'Physics 101',
      subject: 'Study Notes',
      body: 'Newton\'s laws. F=ma. Remember to practice free body diagrams.'
    },
    tasks: [{ text: 'Complete practice set 4' }, { text: 'Read chapter 5' }]
  }
];

const carouselRadius = 260; // Increased radius to spread pages apart

export const App = () => {
  // State definition
  const [view, setView] = useState<'landing' | 'dashboard' | 'calendar' | 'history' | 'pricing' | 'checkout' | 'success' | 'studyPlan'>('landing');
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showScanPage, setShowScanPage] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedDocs = localStorage.getItem('scando_docs');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error("Failed to load docs", e);
      }
    }
    const savedPro = localStorage.getItem('scando_pro');
    if (savedPro === 'true') setIsPro(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('scando_docs', JSON.stringify(documents));
  }, [documents]);

  const handleScan = async (file: File, mode: 'fast' | 'deep') => {
    // Create a temporary placeholder document
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
      
      setDocuments(prev => prev.map(doc => {
        if (doc.id === tempId) {
          return {
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
          };
        }
        return doc;
      }));
    } catch (error) {
      console.error(error);
      setDocuments(prev => prev.map(doc => {
        if (doc.id === tempId) {
          return { ...doc, status: 'error', summary: 'Failed to process document.' };
        }
        return doc;
      }));
    }
  };

  const handleToggleTask = (docId: string, taskId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          tasks: doc.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, isCompleted: !task.isCompleted };
            }
            return task;
          })
        };
      }
      return doc;
    }));
  };

  const handleUpdatePriority = (docId: string, taskId: string, newPriority: Priority) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          tasks: doc.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, priority: newPriority };
            }
            return task;
          })
        };
      }
      return doc;
    }));
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (selectedDocId === docId) setSelectedDocId(null);
  };

  const handleClearData = () => {
    setDocuments([]);
    setSelectedDocId(null);
  };

  const handleProUpgrade = () => {
    setIsPro(true);
    localStorage.setItem('scando_pro', 'true');
    setView('success');
  };

  // View Routing
  const renderContent = () => {
    if (showScanPage) {
      return (
        <ScannerPage 
          onScan={handleScan}
          onNavigate={(v) => {
            if (v === 'dashboard' || v === 'landing') setShowScanPage(false);
            setView(v);
          }}
          currentView="scanner"
          isPro={isPro}
          onOpenPricing={() => setView('pricing')}
        />
      );
    }

    switch (view) {
      case 'landing':
        return (
          <div className="flex flex-col min-h-screen bg-black">
             <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="landing"
                isPro={isPro}
                onOpenPricing={() => setView('pricing')}
              />
              
              <main className="flex flex-col w-full">
                  {/* HERO SECTION */}
                  <section className="relative w-full h-[calc(100vh-64px)] bg-[#F25F4C] overflow-hidden flex flex-col items-center justify-center perspective-[1200px] mb-0">
                    
                    {/* Big Heading */}
                    <h1 
                      className="font-anton text-[28vw] sm:text-[25vw] leading-none text-white select-none tracking-tighter text-center scale-y-110 z-0"
                      style={{ textShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                    >
                        SCANDO
                    </h1>

                    {/* ROTATING 3D CAROUSEL CONTAINER */}
                    <div className="relative w-[140px] h-[200px] md:w-[180px] md:h-[260px] preserve-3d z-10 animate-spin-3d mt-[-5%] sm:mt-[-5%]">
                        {CAROUSEL_ITEMS.map((item, i) => {
                            const totalItems = CAROUSEL_ITEMS.length;
                            const angle = 360 / totalItems;
                            
                            return (
                                <div 
                                    key={i}
                                    className={`absolute inset-0 shadow-2xl rounded-xl preserve-3d`}
                                    style={{ 
                                        transform: `rotateY(${i * angle}deg) translateZ(${carouselRadius}px)`, 
                                    }}
                                >
                                    {/* CARD FACE */}
                                    <div className="absolute inset-0 rounded-xl overflow-hidden backface-hidden bg-black border border-white/10">
                                        {/* CONTENT */}
                                        <div className={`absolute inset-0 ${item.style}`}>
                                            <div className="flex-1 p-3 md:p-5 relative h-full flex flex-col">
                                                <div className="flex justify-between items-center mb-2 opacity-60">
                                                    <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
                                                        {item.icon}
                                                        {item.label}
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        {item.type === 'MESSAGE' ? <Signal size={10}/> : <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>}
                                                        {item.type === 'MESSAGE' ? <Battery size={10}/> : null}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div>
                                                        <h3 className="text-base md:text-lg font-bold leading-tight mb-0.5">{item.content.header}</h3>
                                                        <p className="opacity-70 text-[9px] font-medium">{item.content.subject}</p>
                                                    </div>
                                                    <div className="h-px bg-current opacity-10 w-full"></div>
                                                    <p className={`opacity-80 leading-relaxed whitespace-pre-wrap ${item.type === 'RECEIPT' ? 'text-[8px] font-mono' : 'text-[9px] md:text-[10px]'}`}>
                                                        {item.content.body}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-2 border-t border-white/10">
                                                    <div className="flex items-center gap-1.5 text-[#F25F4C] mb-1 font-mono text-[7px] uppercase tracking-widest">
                                                        <CheckSquare size={8} />
                                                        Tasks Detected
                                                    </div>
                                                    <div className="space-y-0.5">
                                                         {item.tasks.slice(0, 2).map((task, idx) => (
                                                             <div key={idx} className="flex items-center gap-1.5 text-[8px] opacity-60">
                                                                 <div className="w-2 h-2 rounded-full border border-current"></div>
                                                                 <span className="truncate">{task.text}</span>
                                                             </div>
                                                         ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="absolute bottom-12 z-20 flex flex-col items-center gap-4">
                         <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
                            AI-Powered Task Extraction Engine
                         </p>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce text-white/30">
                        <ChevronDown size={32} />
                    </div>

                  </section>

                  {/* MARQUEE SECTION */}
                  <div className="bg-black border-y border-white/10 py-6 overflow-hidden whitespace-nowrap relative">
                      <div className="inline-flex animate-marquee">
                          {[...Array(10)].map((_, i) => (
                              <div key={i} className="flex items-center mx-8 opacity-40">
                                  <span className="font-anton text-2xl mx-4 text-transparent stroke-white" style={{ WebkitTextStroke: '1px white' }}>TRUSTED BY BUILDERS</span>
                                  <span className="text-[#F25F4C] font-mono text-xl">///</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* PROBLEM & FEATURES SECTION */}
                  <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
                      <div className="mb-20">
                           <h2 className="text-4xl md:text-6xl font-anton uppercase leading-none mb-6">
                              Stop drowning in <br/><span className="text-[#F25F4C]">unstructured chaos.</span>
                          </h2>
                          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                              Your best ideas are trapped in screenshots, handwritten notes, and PDF blobs. 
                              ScanDo acts as your intelligence layer, instantly converting visual noise into 
                              structured, executable task lists and study plans.
                          </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                           <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-[#F25F4C]/50 transition-colors group">
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#F25F4C] mb-6 group-hover:bg-[#F25F4C] group-hover:text-black transition-colors">
                                  <Zap size={24} />
                              </div>
                              <h3 className="text-2xl font-bold mb-4">Instant Extraction</h3>
                              <p className="text-gray-400 leading-relaxed">
                                  Our Gemini-powered engine identifies actionable items from messy handwriting, complex PDFs, and screenshots in seconds.
                              </p>
                          </div>

                          <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-[#F25F4C]/50 transition-colors group">
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#F25F4C] mb-6 group-hover:bg-[#F25F4C] group-hover:text-black transition-colors">
                                  <BrainCircuit size={24} />
                              </div>
                              <h3 className="text-2xl font-bold mb-4">Deep Reasoning</h3>
                              <p className="text-gray-400 leading-relaxed">
                                  Upgrade to Pro to unlock Deep Analysis. We don't just find tasks; we build full study plans, schedules, and strategies based on your docs.
                              </p>
                          </div>

                          <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-[#F25F4C]/50 transition-colors group">
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#F25F4C] mb-6 group-hover:bg-[#F25F4C] group-hover:text-black transition-colors">
                                  <CalendarClock size={24} />
                              </div>
                              <h3 className="text-2xl font-bold mb-4">Intelligent Scheduling</h3>
                              <p className="text-gray-400 leading-relaxed">
                                  Detected due dates are automatically synced to your built-in calendar view, ensuring you never miss a deadline.
                              </p>
                          </div>
                      </div>
                  </section>

                  {/* DEEP DIVE / WHY SECTION */}
                  <section className="py-32 px-6 bg-[#050505] border-b border-white/10">
                      <div className="max-w-7xl mx-auto">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                              <div className="order-2 lg:order-1 perspective-[1200px]">
                                   {/* IMPROVED 3D SCANNER ANIMATION */}
                                   <div className="relative h-[600px] w-full bg-[#050505] rounded-[3rem] border border-white/10 overflow-hidden group hover:border-[#F25F4C]/40 transition-colors duration-500 shadow-2xl">
                                      
                                      {/* Background Grid & Glow */}
                                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(242,95,76,0.05),transparent_70%)]"></div>
                                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_scale(2)]"></div>

                                      <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                                          <div className="relative w-72 h-96 preserve-3d">
                                              
                                              {/* LAYER 1: The Raw Document (Back Layer) */}
                                              <div className="absolute inset-0 bg-[#111] rounded-2xl border border-white/10 p-6 transform transition-all duration-1000 ease-out group-hover:rotate-x-12 group-hover:translate-y-8 group-hover:opacity-40 flex flex-col gap-4">
                                                  <div className="w-1/3 h-3 bg-white/10 rounded-full mb-4"></div>
                                                  <div className="w-full h-2 bg-white/5 rounded-full"></div>
                                                  <div className="w-5/6 h-2 bg-white/5 rounded-full"></div>
                                                  <div className="w-4/5 h-2 bg-white/5 rounded-full"></div>
                                                  <div className="w-full h-32 bg-white/5 rounded-lg mt-2 border border-dashed border-white/10 flex items-center justify-center">
                                                      <FileText className="text-white/10" size={32} />
                                                  </div>
                                              </div>

                                              {/* LAYER 2: The Scanning Laser */}
                                              <div className="absolute left-[-10%] w-[120%] h-1 bg-[#F25F4C] shadow-[0_0_40px_rgba(242,95,76,0.8),0_0_10px_#F25F4C] z-30 animate-scan-beam opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                              {/* LAYER 3: Extracted Data (Hologram) */}
                                              <div className="absolute inset-0 z-20 flex flex-col justify-between transform transition-all duration-1000 delay-100 group-hover:-translate-y-12 group-hover:translate-z-20">
                                                  
                                                  {/* Floating UI Card that materializes */}
                                                  <div className="w-full bg-black/90 backdrop-blur-xl border border-[#F25F4C] rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out border-b-4 border-b-[#F25F4C]">
                                                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                                          <div className="flex items-center gap-2">
                                                              <div className="w-2 h-2 rounded-full bg-[#F25F4C] animate-pulse"></div>
                                                              <span className="text-[10px] font-mono text-[#F25F4C] uppercase tracking-widest">Extracted_Data</span>
                                                          </div>
                                                          <CheckCircle2 size={12} className="text-[#F25F4C]" />
                                                      </div>
                                                      <div className="space-y-3">
                                                          <div className="flex items-center gap-3">
                                                              <div className="w-4 h-4 rounded border border-[#F25F4C]/50 flex items-center justify-center">
                                                                  <div className="w-2 h-2 bg-[#F25F4C] rounded-[1px]"></div>
                                                              </div>
                                                              <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                                                          </div>
                                                          <div className="flex items-center gap-3">
                                                              <div className="w-4 h-4 rounded border border-gray-700"></div>
                                                              <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                                                          </div>
                                                          <div className="flex items-center gap-3">
                                                              <div className="w-4 h-4 rounded border border-gray-700"></div>
                                                              <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  {/* Connection Lines (Simulated Data Stream) */}
                                                  <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-transparent via-[#F25F4C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300"></div>
                                              </div>

                                          </div>
                                      </div>
                                      
                                      {/* Overlay UI */}
                                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                                          <div className="font-mono text-[10px] text-[#F25F4C]">
                                              <p>AI_MODEL: GEMINI-1.5-PRO</p>
                                              <p>STATUS: <span className="animate-pulse">AWAITING_INPUT</span></p>
                                          </div>
                                          <ScanLine className="text-white/20" size={24} />
                                      </div>
                                   </div>
                              </div>

                              <div className="order-1 lg:order-2">
                                   <h2 className="text-4xl md:text-5xl font-anton uppercase leading-none mb-8">
                                      Why <span className="text-[#F25F4C]">Builders</span><br/>
                                      Choose ScanDo.
                                  </h2>
                                  
                                  <div className="space-y-10">
                                      <div className="flex gap-6">
                                          <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center text-[#F25F4C] shrink-0 border border-white/10">
                                              <BrainCircuit size={28} />
                                          </div>
                                          <div>
                                              <h3 className="text-xl font-bold text-white mb-2">Cognitive Offloading</h3>
                                              <p className="text-gray-400 leading-relaxed text-lg">
                                                  Your brain is for having ideas, not holding them. Dump your raw thoughts, messy notes, and random screenshots into ScanDo. We structure them so you can execute.
                                              </p>
                                          </div>
                                      </div>

                                      <div className="flex gap-6">
                                          <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center text-[#F25F4C] shrink-0 border border-white/10">
                                              <Target size={28} />
                                          </div>
                                          <div>
                                              <h3 className="text-xl font-bold text-white mb-2">Context-Aware Extraction</h3>
                                              <p className="text-gray-400 leading-relaxed text-lg">
                                                  Standard OCR just reads text. ScanDo understands intent. We distinguish between a meeting note that needs a follow-up email and a receipt that needs expense logging.
                                              </p>
                                          </div>
                                      </div>

                                      <div className="flex gap-6">
                                          <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center text-[#F25F4C] shrink-0 border border-white/10">
                                              <LayoutGrid size={28} />
                                          </div>
                                          <div>
                                              <h3 className="text-xl font-bold text-white mb-2">Structured Clarity</h3>
                                              <p className="text-gray-400 leading-relaxed text-lg">
                                                  Turn messy streams of consciousness into rigid, actionable JSON structures. We bring order to the entropy of your notebook.
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* PRICING COMPARISON SECTION */}
                  <section className="py-24 px-6 max-w-7xl mx-auto">
                      <div className="text-center mb-16">
                           <h2 className="text-4xl font-anton uppercase mb-4">Choose your Engine</h2>
                           <p className="text-gray-400">Scale your productivity with the right toolset.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                          {/* Free Card */}
                          <div className="p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 flex flex-col hover:bg-[#111] transition-colors group">
                              <div className="mb-8 text-center">
                                  <h3 className="text-2xl font-bold text-gray-300 mb-2">Starter</h3>
                                  <div className="text-5xl font-anton text-white mb-4">$0</div>
                                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                      Perfect for students and casual organizers. Experience the power of AI note extraction without commitment.
                                  </p>
                              </div>
                              
                              <div className="space-y-6 mb-10 flex-1">
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-white bg-white/10 p-1 rounded-full w-fit h-fit"><CheckCircle2 size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">3 Smart Scans Daily</p>
                                          <p className="text-xs text-gray-500 mt-1">Enough for daily class notes or meeting minutes.</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-white bg-white/10 p-1 rounded-full w-fit h-fit"><CheckCircle2 size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">Standard Processing</p>
                                          <p className="text-xs text-gray-500 mt-1">Powered by Gemini Flash for speed.</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-white bg-white/10 p-1 rounded-full w-fit h-fit"><CheckCircle2 size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">7-Day History</p>
                                          <p className="text-xs text-gray-500 mt-1">Recent items kept for a week.</p>
                                      </div>
                                   </div>
                              </div>

                              <button 
                                   onClick={() => {
                                      setView('dashboard');
                                      setShowScanPage(true);
                                   }}
                                   className="w-full py-4 border border-white/20 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
                              >
                                  Start Free
                              </button>
                          </div>

                          {/* Pro Card */}
                          <div className="relative p-10 rounded-[2.5rem] bg-[#111] border-2 border-[#F25F4C] flex flex-col transform md:-translate-y-4 shadow-[0_0_50px_rgba(242,95,76,0.15)]">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F25F4C] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                  Power User Choice
                              </div>
                              
                              <div className="mb-8 text-center">
                                  <h3 className="text-2xl font-bold text-[#F25F4C] mb-2">Pro Access</h3>
                                  <div className="text-5xl font-anton text-white mb-4">$5.99<span className="text-lg text-gray-500 font-sans font-normal">/mo</span></div>
                                  <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                      Unlock the Gemini Pro reasoning engine for complex study plans and unlimited archival.
                                  </p>
                              </div>

                              <div className="space-y-6 mb-10 flex-1">
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-black bg-[#F25F4C] p-1 rounded-full w-fit h-fit"><Infinity size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">Unlimited Scans</p>
                                          <p className="text-xs text-gray-500 mt-1">Never hit a wall. Scan your entire library.</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-black bg-[#F25F4C] p-1 rounded-full w-fit h-fit"><BrainCircuit size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">Deep Reasoning Engine</p>
                                          <p className="text-xs text-gray-500 mt-1">Gemini Pro breaks down complex topics into plans.</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-black bg-[#F25F4C] p-1 rounded-full w-fit h-fit"><Database size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">Long-term Memory</p>
                                          <p className="text-xs text-gray-500 mt-1">Searchable history of everything you've ever scanned.</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <div className="mt-1 text-black bg-[#F25F4C] p-1 rounded-full w-fit h-fit"><Zap size={14}/></div>
                                      <div>
                                          <p className="font-bold text-white text-sm">Priority Queue</p>
                                          <p className="text-xs text-gray-500 mt-1">Skip the line during peak hours.</p>
                                      </div>
                                   </div>
                              </div>

                              <button 
                                   onClick={() => setView('pricing')}
                                   className="w-full py-4 bg-[#F25F4C] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_4px_20px_rgba(242,95,76,0.3)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.3)]"
                              >
                                  Upgrade Now
                              </button>
                          </div>
                      </div>
                  </section>

                  {/* CTA FOOTER */}
                  <section className="py-32 px-6 bg-black relative overflow-hidden text-center">
                       <div className="absolute inset-0 bg-gradient-to-t from-[#F25F4C]/20 to-transparent pointer-events-none"></div>
                       <div className="relative z-10 max-w-3xl mx-auto">
                           <h2 className="text-5xl md:text-7xl font-anton uppercase mb-8">Ready to do?</h2>
                           <p className="text-xl text-gray-400 mb-12">Join 10,000+ users organizing their life with AI.</p>
                           
                           <div className="flex flex-col sm:flex-row gap-6 justify-center">
                              <button 
                                  onClick={() => setView('dashboard')}
                                  className="px-10 py-5 bg-[#F25F4C] text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(242,95,76,0.4)]"
                              >
                                  Launch Web App
                              </button>
                           </div>
                       </div>
                  </section>
              </main>
          </div>
        );

      case 'dashboard':
        return (
          <div className="min-h-screen bg-black flex flex-col">
             <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="dashboard"
                isPro={isPro}
                onOpenPricing={() => setView('pricing')}
              />
              <div className="flex-1 p-6 md:p-12 max-w-[1600px] mx-auto w-full">
                  <div className="flex items-end justify-between mb-8 md:mb-12">
                      <div>
                          <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">Dashboard</h2>
                          <p className="text-[#F25F4C] font-mono text-sm uppercase tracking-widest">Active Workspace</p>
                      </div>
                      <button 
                        onClick={() => setShowScanPage(true)}
                        className="hidden md:flex bg-[#F25F4C] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider items-center gap-2 hover:bg-white transition-colors"
                      >
                          <Plus size={20} /> New Scan
                      </button>
                  </div>

                  {documents.length === 0 ? (
                      <div className="w-full h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-[#111] gap-6">
                          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                              <LayoutGrid size={40} />
                          </div>
                          <div className="text-center">
                              <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
                              <p className="text-gray-500 max-w-sm mx-auto">Upload a screenshot, receipt, or handwritten note to extract tasks.</p>
                          </div>
                          <button 
                            onClick={() => setShowScanPage(true)}
                            className="text-[#F25F4C] hover:text-white font-mono text-sm uppercase tracking-wider font-bold"
                          >
                              Start Scanning
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {documents.map((doc, idx) => (
                              <TaskCard 
                                key={doc.id} 
                                document={doc} 
                                onClick={() => setSelectedDocId(doc.id)} 
                                index={idx}
                              />
                          ))}
                      </div>
                  )}
              </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="min-h-screen bg-black flex flex-col">
              <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="calendar"
                isPro={isPro}
                onOpenPricing={() => setView('pricing')}
              />
              <CalendarPage 
                documents={documents} 
                onToggleTask={handleToggleTask} 
              />
          </div>
        );

      case 'history':
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="history"
                isPro={isPro}
                onOpenPricing={() => setView('pricing')}
              />
              <HistoryPage 
                documents={documents} 
                onSelectDocument={(id) => setSelectedDocId(id)}
                onBack={() => setView('dashboard')}
              />
           </div>
        );

      case 'pricing':
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="pricing"
                isPro={isPro}
                onOpenPricing={() => {}}
              />
              <PricingPage 
                onBack={() => setView('dashboard')}
                onGoToCheckout={() => setView('checkout')}
              />
           </div>
        );

      case 'checkout':
        return (
          <div className="min-h-screen bg-black flex flex-col">
             <CheckoutPage 
                onBack={() => setView('pricing')}
                onSuccess={handleProUpgrade}
             />
          </div>
        );

      case 'success':
        return (
          <SuccessPage onContinue={() => setView('dashboard')} />
        );

      case 'studyPlan':
        const docForPlan = documents.find(d => d.id === selectedDocId);
        if (!docForPlan) {
          setView('dashboard');
          return null;
        }
        return (
           <div className="min-h-screen bg-black flex flex-col">
              <Header 
                onUploadClick={() => setShowScanPage(true)} 
                onNavigate={setView}
                currentView="dashboard"
                isPro={isPro}
                onOpenPricing={() => setView('pricing')}
              />
              <StudyPlanPage 
                document={docForPlan} 
                onBack={() => {
                   setView('dashboard');
                   setSelectedDocId(docForPlan.id); 
                }}
              />
           </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-white font-sans selection:bg-[#F25F4C] selection:text-black">
      {renderContent()}

      {/* MODAL OVERLAY */}
      {selectedDocId && view !== 'studyPlan' && (
        <TaskDetailModal 
          document={documents.find(d => d.id === selectedDocId)!} 
          onClose={() => setSelectedDocId(null)}
          onToggleTask={handleToggleTask}
          onUpdatePriority={handleUpdatePriority}
          onDelete={handleDelete}
          onViewStudyPlan={(id) => {
             setSelectedDocId(id);
             setView('studyPlan');
          }}
        />
      )}

      {/* File Upload Modal (if triggered separately, though Header handles it via ScanPage mostly) */}
      {isUploadOpen && (
        <FileUpload 
          onFileSelect={(file) => {
             handleScan(file, 'fast');
             setIsUploadOpen(false);
          }}
          onClose={() => setIsUploadOpen(false)}
        />
      )}
    </div>
  );
};
