import React from 'react';
import { ScannedDocument } from '../types';
import { Clock, FileText, ArrowRight, CheckCircle2, Calendar, Search, Filter } from 'lucide-react';

interface HistoryPageProps {
  documents: ScannedDocument[];
  onSelectDocument: (docId: string) => void;
  onBack: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ documents, onSelectDocument, onBack }) => {
  // Sort documents by date descending
  const sortedDocs = [...documents].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-in fade-in duration-500">
        <div className="flex items-end justify-between mb-16 border-b border-white/20 pb-4">
            <div>
                <h1 className="text-6xl font-anton uppercase tracking-tighter leading-none mb-2 text-white">History</h1>
                <p className="font-mono text-sm text-[#F25F4C] uppercase tracking-widest">
                    Timeline: {documents.length} Records
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left Sidebar: Stats/Filter */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Filter size={12} /> Filter Stream
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium">All Scans</span>
                            <span className="text-xs bg-[#F25F4C] text-black px-1.5 py-0.5 rounded font-bold">{documents.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-transparent rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors text-gray-400">
                            <span className="text-sm font-medium">Completed</span>
                            <span className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-bold">
                                {documents.filter(d => d.tasks.every(t => t.isCompleted)).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Timeline */}
            <div className="lg:col-span-3">
                <div className="relative border-l border-white/10 ml-4 lg:ml-0 space-y-12">
                    {sortedDocs.length > 0 ? (
                        sortedDocs.map((doc, idx) => (
                            <div key={doc.id} className="relative pl-8 lg:pl-12 group">
                                {/* Timeline Node */}
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-black border-2 border-[#F25F4C] rounded-full z-10 group-hover:scale-125 transition-transform"></div>
                                
                                <div 
                                    onClick={() => onSelectDocument(doc.id)}
                                    className="bg-[#111] rounded-2xl border border-white/10 p-6 hover:border-[#F25F4C]/50 hover:bg-[#1a1a1a] transition-all cursor-pointer flex flex-col sm:flex-row gap-6"
                                >
                                    {/* Date */}
                                    <div className="sm:w-32 flex-shrink-0">
                                        <p className="text-[#F25F4C] font-mono text-xs uppercase tracking-widest mb-1">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#F25F4C] transition-colors">{doc.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{doc.summary}</p>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                                <CheckCircle2 size={12} className={doc.tasks.every(t => t.isCompleted) ? "text-green-500" : "text-gray-500"} />
                                                {doc.tasks.filter(t => t.isCompleted).length}/{doc.tasks.length} Tasks
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                                <FileText size={12} />
                                                {doc.fileType.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-center sm:border-l border-white/10 sm:pl-6">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#F25F4C] group-hover:bg-[#F25F4C]/10 transition-colors">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="pl-12 text-gray-500 font-mono">No history available.</div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};