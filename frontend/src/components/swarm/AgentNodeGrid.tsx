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
    <div className="bg-black/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden h-[500px]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      <h3 className="text-white font-bold mb-6 relative z-10 flex items-center gap-2">
        <Activity size={18} className="text-emerald-500" /> Live Node Operations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
