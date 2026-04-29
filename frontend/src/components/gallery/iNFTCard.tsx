import React from 'react';
import { Brain, Database, HardDrive, ShieldCheck } from 'lucide-react';

interface iNFTCardProps {
  id: string;
  name: string;
  type: string;
  memory: string;
  health: string;
}

export default function iNFTCard({ id, name, type, memory, health }: iNFTCardProps) {
  return (
    <div className="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden hover:border-emerald-500/40 transition-all">
      {/* AGENT AVATAR AREA */}
      <div className="h-48 bg-gradient-to-br from-blue-900/40 to-emerald-900/40 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
        <Brain size={64} className="text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
          ID: {id}
        </div>
      </div>

      {/* AGENT INFO */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <ShieldCheck size={18} className="text-emerald-500" />
        </div>
        
        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{type}</p>

        <div className="space-y-2 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 flex items-center gap-1"><Database size={10} /> Memory CID (0G)</span>
            <span className="text-blue-400 font-mono">{memory}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 flex items-center gap-1"><HardDrive size={10} /> Brain Health</span>
            <span className="text-emerald-500 font-bold">{health}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-white/5 hover:bg-emerald-500 hover:text-black transition-all py-3 rounded-xl text-xs font-bold uppercase tracking-tighter">
          View On-Chain Data
        </button>
      </div>
    </div>
  );
}
