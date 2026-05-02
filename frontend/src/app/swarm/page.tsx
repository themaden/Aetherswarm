"use client";

import React, { useEffect, useState } from 'react';
import { Network, Cpu, BrainCircuit } from 'lucide-react';

export default function SwarmPage() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/agents');
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter(a => a.status === 'Active').length;

  return (
    <div className="space-y-8 fade-in-up">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 mb-1 tracking-tight">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
              <Network className="text-blue-400" size={22} />
            </div>
            Swarm Intelligence
          </h1>
          <p className="text-slate-600 text-xs">Ajan verileri backend API&apos;den canlı olarak çekiliyor.</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeCount} / {agents.length} Active</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Toplam Ajan</p>
          <p className="text-2xl font-black text-white">{agents.length}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Aktif</p>
          <p className="text-2xl font-black text-emerald-400">{activeCount}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">İletişim</p>
          <p className="text-2xl font-black text-blue-400">P2P</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Şifreleme</p>
          <p className="text-2xl font-black text-purple-400">TLS</p>
        </div>
      </div>

      {/* AGENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent: any) => (
          <div key={agent.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/[0.08] rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Cpu size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{agent.name}</p>
                  <p className="text-[10px] text-slate-600">{agent.role}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`}></div>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-600">Konum</span>
              <span className="text-white font-mono">{agent.location}</span>
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-slate-600">Durum</span>
              <span className={agent.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{agent.status}</span>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-600 text-xs">Backend bekleniyor...</div>
        )}
      </div>

      {/* INFO */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-400" /> Protokol Bilgisi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.04]">
            <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">İletişim Protokolü</p>
            <p className="text-white font-mono">Gensyn AXL (P2P)</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.04]">
            <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">Araç Erişimi</p>
            <p className="text-white font-mono">MCP (JSON-RPC)</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.04]">
            <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">Görev Delegasyonu</p>
            <p className="text-white font-mono">A2A Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
