'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import AgentNode from './AgentNode';

const AGENT_NODES = [
  { name: 'Node Alpha', role: 'Market Analyzer', status: 'Scanning Pools', location: 'US-East' },
  { name: 'Node Beta', role: 'Sentiment Engine', status: 'Parsing Twitter', location: 'EU-Central', delay: 'animation-delay-200' },
  { name: 'Node Gamma', role: 'Execution Router', status: 'Idle (Awaiting Signal)', location: 'AP-South', delay: 'animation-delay-400' },
  { name: 'Hook Sentinel', role: 'Uniswap v4 Guardian', status: 'Defending LVR', location: 'On-Chain', delay: 'animation-delay-150' },
  { name: '0G Broker', role: 'Sealed Inference', status: 'Generating Proofs', location: 'TEE Enclave', delay: 'animation-delay-500' },
];

export default function AgentNodeGrid() {
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
        {AGENT_NODES.map((node) => (
          <AgentNode
            key={node.name}
            name={node.name}
            role={node.role}
            status={node.status}
            location={node.location}
            delay={node.delay}
          />
        ))}
      </div>
    </div>
  );
}
