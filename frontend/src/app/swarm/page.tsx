"use client";

import React from 'react';
import { Network } from 'lucide-react';
import SwarmStats from '@/components/swarm/SwarmStats';
import AgentNodeGrid from '@/components/swarm/AgentNodeGrid';

export default function SwarmPage() {
  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div className="fade-in-up">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
            <Network className="text-blue-400" size={28} />
          </div>
          Ghost Swarm Topology
        </h1>
        <p className="text-slate-500 text-sm">Live visualization of Gensyn AXL peer-to-peer agent communications.</p>
      </div>

      {/* STATS ROW */}
      <div className="fade-in-up fade-in-up-1">
        <SwarmStats />
      </div>

      {/* NODE VISUALIZATION GRID */}
      <div className="fade-in-up fade-in-up-2">
        <AgentNodeGrid />
      </div>
    </div>
  );
}
