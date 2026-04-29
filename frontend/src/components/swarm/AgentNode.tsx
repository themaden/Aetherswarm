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
    <div className={`bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm relative group overflow-hidden ${delay}`}>
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
        <Server size={40} className="text-blue-500" />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="relative">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
      </div>
      
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Role:</span>
          <span className="text-blue-400 font-bold">{role}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Task:</span>
          <span className="text-emerald-400 font-bold">{status}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Zone:</span>
          <span className="text-slate-300 font-bold">{location}</span>
        </div>
      </div>
    </div>
  );
}
