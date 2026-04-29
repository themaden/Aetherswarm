"use client";

import React from 'react';
import { Network } from 'lucide-react';
import SwarmStats from '@/components/swarm/SwarmStats';
import AgentNodeGrid from '@/components/swarm/AgentNodeGrid';

export default function SwarmPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
          <Network className="text-blue-500" size={32} />
          Ghost Swarm Topology
        </h1>
        <p className="text-slate-400">Live visualization of Gensyn AXL peer-to-peer agent communications.</p>
      </div>

      {/* STATS ROW */}
      <SwarmStats />

      {/* NODE VISUALIZATION GRID */}
      <AgentNodeGrid />
    </div>
  );
}
