import React from 'react';
import { Brain, Database, HardDrive, ShieldCheck } from 'lucide-react';

interface INFTCardProps {
  id: string;
  name: string;
  type: string;
  memory: string;
  health: string;
}

export default function INFTCard({ id, name, type, memory, health }: INFTCardProps) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover-lift">
      {/* AGENT AVATAR AREA */}
      <div className="h-48 bg-gradient-to-br from-blue-900/30 via-slate-900/40 to-emerald-900/30 flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 dot-grid opacity-40"></div>
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/[0.08] blur-[60px] rounded-full group-hover:bg-emerald-500/[0.15] transition-all duration-700"></div>
        
        <Brain size={56} className="text-emerald-400/70 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500 relative z-10 drop-shadow-lg" />
        
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg text-[10px] font-bold text-white border border-white/[0.08]">
          ID: {id}
        </div>
      </div>

      {/* AGENT INFO */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <ShieldCheck size={16} className="text-emerald-400" />
        </div>
        
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.15em]">{type}</p>

        <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 flex items-center gap-1.5"><Database size={10} /> Memory CID (0G)</span>
            <span className="text-blue-400 font-mono font-semibold">{memory}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 flex items-center gap-1.5"><HardDrive size={10} /> Brain Health</span>
            <span className="text-emerald-400 font-bold">{health}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-white/[0.04] hover:bg-emerald-500 hover:text-black border border-white/[0.06] hover:border-emerald-500 transition-all duration-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:shadow-lg group-hover:shadow-emerald-500/10">
          View On-Chain Data
        </button>
      </div>
    </div>
  );
}
