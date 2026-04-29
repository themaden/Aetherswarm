import React from 'react';
import { Server } from 'lucide-react';

interface AgentNodeProps {
  name: string;
  role: string;
  status: string;
  location: string;
  delay?: string;
}

export default function AgentNode({ name, role, status, location, delay = '' }: AgentNodeProps) {
  return (
    <div className={`bg-white/[0.03] border border-white/[0.06] p-5 rounded-2xl backdrop-blur-sm relative group overflow-hidden hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 hover-lift ${delay}`}>
      {/* Background icon */}
      <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-500">
        <Server size={48} className="text-blue-400" />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="relative">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping absolute opacity-40"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full relative shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
        </div>
        <h3 className="text-base font-bold text-white">{name}</h3>
      </div>
      
      <div className="space-y-2.5 relative z-10">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Role:</span>
          <span className="text-blue-400 font-semibold">{role}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Task:</span>
          <span className="text-emerald-400 font-semibold">{status}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Zone:</span>
          <span className="text-slate-300 font-semibold">{location}</span>
        </div>
      </div>
    </div>
  );
}
