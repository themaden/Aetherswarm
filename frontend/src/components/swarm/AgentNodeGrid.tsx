'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { useSwarmAgents } from '@/hooks/useSwarmAgents';
import AgentNode from './AgentNode';

const DELAYS = ['', 'animation-delay-200', 'animation-delay-400', 'animation-delay-150', 'animation-delay-500'];

export default function AgentNodeGrid() {
  const { agents, isLoading, error } = useSwarmAgents();

  return (
    <div className="bg-black/30 border border-white/[0.06] p-8 rounded-2xl relative overflow-hidden h-[500px]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 dot-grid opacity-60"></div>
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/[0.03] blur-[80px] rounded-full pointer-events-none"></div>
      
      <h3 className="text-white font-bold mb-6 relative z-10 flex items-center gap-2.5 text-sm">
        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
          <Activity size={14} className="text-emerald-400" />
        </div>
        Live Node Operations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {isLoading && (
          <div className="col-span-full text-sm text-slate-500 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6">
            Loading swarm nodes...
          </div>
        )}

        {!isLoading && error && (
          <div className="col-span-full text-sm text-red-300 border border-red-500/10 bg-red-500/[0.04] rounded-2xl p-6">
            Swarm API is unavailable.
          </div>
        )}

        {!isLoading && !error && agents.map((node, index) => (
          <AgentNode
            key={node.id}
            name={node.name}
            role={node.role || 'Swarm Agent'}
            status={node.status}
            location={node.location}
            delay={DELAYS[index % DELAYS.length]}
          />
        ))}
      </div>
    </div>
  );
}
