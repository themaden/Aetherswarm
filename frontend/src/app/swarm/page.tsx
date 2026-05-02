"use client";

import React, { useEffect, useState } from 'react';
import { Network, Cpu, Activity, Radio, Shield, ArrowRight } from 'lucide-react';

export default function GhostSwarmPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const r = await fetch('http://localhost:3001/api/agents');
        const d = await r.json();
        setAgents(d.agents || []);
        setLoaded(true);
      } catch { setLoaded(true); }
    };
    fetch_();
    const iv = setInterval(fetch_, 4000);
    return () => clearInterval(iv);
  }, []);

  const active = agents.filter(a => a.status === 'Active').length;

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="fade-in-up">
        <div className="text-[9px] font-bold tracking-[0.2em] text-slate-700 uppercase mb-2">Gensyn AXL · P2P Mesh</div>
        <h1 className="text-2xl font-black text-white tracking-tight">Ghost <span className="gradient-text-blue">Swarm</span></h1>
        <p className="text-xs text-slate-600 mt-1">Decentralized agent network — no central server, no single point of failure</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fade-in-up fade-in-up-1">
        {[
          { label: 'Total Agents',   val: agents.length.toString(), color: 'text-white' },
          { label: 'Active',         val: active.toString(),         color: 'text-emerald-400' },
          { label: 'Protocol',       val: 'AXL P2P',                color: 'text-purple-400' },
          { label: 'Encryption',     val: 'TLS/Yggdrasil',          color: 'text-cyan-400' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.018] px-4 py-3">
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-lg font-black font-mono ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* AGENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in-up fade-in-up-2">
        {agents.map((agent: any, i) => (
          <AgentCard key={agent.id} agent={agent} delay={i} />
        ))}
        {!loaded && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[140px] rounded-2xl border border-white/[0.04] bg-white/[0.01] animate-pulse" />
        ))}
      </div>

      {/* PROTOCOL INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up fade-in-up-3">
        {[
          {
            icon: <Radio size={18} className="text-purple-400" />,
            title: 'Gensyn AXL', subtitle: 'Agent eXchange Layer',
            body: 'Each agent runs a local AXL node using gVisor stack — NAT traversal without port forwarding.',
            color: 'border-purple-500/10 bg-purple-500/[0.03]',
          },
          {
            icon: <Shield size={18} className="text-cyan-400" />,
            title: 'MCP Protocol', subtitle: 'Model Context Protocol',
            body: 'Standard JSON-RPC tool access for financial APIs: price feeds, sentiment data, on-chain analytics.',
            color: 'border-cyan-500/10 bg-cyan-500/[0.03]',
          },
          {
            icon: <Activity size={18} className="text-blue-400" />,
            title: 'A2A Protocol', subtitle: 'Agent-to-Agent',
            body: 'Risk agents delegate to Portfolio Manager. Signals cascade through the mesh without a coordinator.',
            color: 'border-blue-500/10 bg-blue-500/[0.03]',
          },
        ].map((p, i) => (
          <div key={i} className={`rounded-2xl border p-5 hover-lift ${p.color}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">{p.icon}</div>
              <div>
                <p className="text-sm font-black text-white">{p.title}</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{p.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ agent, delay }: { agent: any; delay: number }) {
  const isActive = agent.status === 'Active';
  const roleColors: Record<string, string> = {
    'Market Analyzer':    'text-blue-400   bg-blue-500/[0.06]   border-blue-500/15',
    'Sentiment Engine':   'text-purple-400 bg-purple-500/[0.06] border-purple-500/15',
    'Execution Router':   'text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/15',
    'Uniswap v4 Guardian':'text-amber-400  bg-amber-500/[0.06]  border-amber-500/15',
    'Sealed Inference':   'text-cyan-400   bg-cyan-500/[0.06]   border-cyan-500/15',
  };
  const roleColor = roleColors[agent.role] ?? 'text-slate-400 bg-white/[0.04] border-white/[0.06]';

  return (
    <div className={`fade-in-up fade-in-up-${Math.min(delay + 1, 5)} group relative rounded-2xl border p-5 overflow-hidden transition-all hover-lift gradient-border-animated ${
      isActive ? 'border-white/[0.07]' : 'border-white/[0.04]'
    }`} style={{ background: 'rgba(255,255,255,0.018)' }}>
      {/* Background dot pattern on hover */}
      <div className="absolute inset-0 dot-pattern opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${roleColor} border`}>
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-white">{agent.name}</p>
              <p className={`text-[9px] font-bold ${roleColor.split(' ')[0]}`}>{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-700'}`} />
            <span className={`text-[8px] font-bold uppercase ${isActive ? 'text-emerald-500' : 'text-slate-700'}`}>{agent.status}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9px] text-slate-700">
            <Network size={10} />
            <span className="font-mono">{agent.location}</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-slate-800 group-hover:text-blue-400 transition-colors">
            <span>View</span>
            <ArrowRight size={9} />
          </div>
        </div>
      </div>
    </div>
  );
}
