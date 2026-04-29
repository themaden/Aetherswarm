"use client";

import React from 'react';
import { Activity, Network, Server, Cpu } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SwarmStat title="Active Nodes" value="12" color="text-blue-500" />
        <SwarmStat title="Network Latency" value="42ms" color="text-emerald-500" />
        <SwarmStat title="Encrypted Tunnels" value="TLS 1.3" color="text-purple-500" />
        <SwarmStat title="Total Signals (24h)" value="14,204" color="text-amber-500" />
      </div>

      {/* NODE VISUALIZATION GRID */}
      <div className="bg-black/40 border border-white/5 p-8 rounded-3xl relative overflow-hidden h-[500px]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <h3 className="text-white font-bold mb-6 relative z-10 flex items-center gap-2">
          <Activity size={18} className="text-emerald-500" /> Live Node Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <AgentNode name="Node Alpha" role="Market Analyzer" status="Scanning Pools" location="US-East" />
          <AgentNode name="Node Beta" role="Sentiment Engine" status="Parsing Twitter" location="EU-Central" delay="animation-delay-200" />
          <AgentNode name="Node Gamma" role="Execution Router" status="Idle (Awaiting Signal)" location="AP-South" delay="animation-delay-400" />
          <AgentNode name="Hook Sentinel" role="Uniswap v4 Guardian" status="Defending LVR" location="On-Chain" delay="animation-delay-150" />
          <AgentNode name="0G Broker" role="Sealed Inference" status="Generating Proofs" location="TEE Enclave" delay="animation-delay-500" />
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function SwarmStat({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
      <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{title}</h4>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function AgentNode({ name, role, status, location, delay = "" }: { name: string, role: string, status: string, location: string, delay?: string }) {
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