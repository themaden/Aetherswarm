"use client";

import React from 'react';
import { Network, Cpu, BrainCircuit, Activity } from 'lucide-react';
import SwarmStats from '@/components/swarm/SwarmStats';
import AgentNodeGrid from '@/components/swarm/AgentNodeGrid';

export default function SwarmPage() {
  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div className="fade-in-up flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
              <Network className="text-blue-400" size={28} />
            </div>
            Gensyn AXL Swarm Topology
          </h1>
          <p className="text-slate-500 text-sm italic">Decentralized Compute & Neural Linkage powered by Gensyn Protocol.</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-3">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mesh Connection: Stable</span>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="fade-in-up fade-in-up-1">
        <SwarmStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* NODE VISUALIZATION GRID */}
        <div className="lg:col-span-8 fade-in-up fade-in-up-2">
          <AgentNodeGrid />
        </div>

        {/* COMPUTE INFO */}
        <div className="lg:col-span-4 space-y-6 fade-in-up fade-in-up-3">
          <div className="bg-gradient-to-br from-blue-600/[0.1] to-purple-600/[0.1] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-blue-400" /> Compute Resources
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Collective FLOPs</span>
                  <span className="text-blue-400">12.4 PetaFLOPs</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[75%] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Training Convergence</span>
                  <span className="text-emerald-400">99.2%</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[92%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/[0.05]">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                <span className="text-blue-400 font-bold">AXL Protocol:</span> Verifying compute proofs via Gensyn verification nodes. Attestation successful.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <BrainCircuit size={16} className="text-purple-400" /> Neural State
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Model Type', val: 'Llama-3-Swarm' },
                { label: 'Latency', val: '14ms' },
                { label: 'Synapse Sync', val: 'Active' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs text-white font-mono font-bold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

