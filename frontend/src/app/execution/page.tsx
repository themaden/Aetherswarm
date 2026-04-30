"use client";

import React, { useEffect, useState } from 'react';
import { Zap, ShieldCheck, Activity, BarChart3, ArrowUpRight } from 'lucide-react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

export default function ExecutionPage() {
  const [hookStatus, setHookStatus] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(API_ENDPOINTS.HOOK_STATUS)
      .then(data => setHookStatus(data.hook))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="fade-in-up">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/10">
            <Zap className="text-purple-400" size={28} />
          </div>
          Uniswap v4 Execution Engine
        </h1>
        <p className="text-slate-500 text-sm italic">Powered by AetherSwarm Smart Hooks & Uniswap Foundation Aligned.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOOK STATUS CARD */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={80} />
          </div>
          <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Hook Controller</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-black text-white">{hookStatus?.name || 'SwarmHook'}</p>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Activity size={10} /> ACTIVE ON-CHAIN
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.05] space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Protection Mode</span>
                <span className="text-white font-mono">{hookStatus?.protectionMode || 'LVR'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dynamic Fee</span>
                <span className="text-purple-400 font-bold font-mono">{hookStatus?.dynamicFee || '0.42%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART MOCKUP CARD */}
        <div className="lg:col-span-2 bg-black/40 border border-white/[0.08] rounded-2xl p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-400" /> 
              Fee Volatility Mitigation
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Live Simulation</span>
          </div>
          {/* Simple CSS-based bar chart for visual appeal */}
          <div className="flex items-end gap-2 h-32">
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 40].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-sm transition-all duration-1000 ${i === 8 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`} 
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase">
            <span>T-12h</span>
            <span className="text-purple-400">Peak Volatility (Hook Active)</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* RECENT EXECUTIONS */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest">Pool</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest">Swap Fee</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest">Savings</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {[
              { tx: '0x82f...3c9', pool: 'ETH / USDC', fee: '0.42%', save: '+$12.50', status: 'Optimized' },
              { tx: '0x1a2...7b4', pool: 'WBTC / USDC', fee: '0.35%', save: '+$8.20', status: 'Optimized' },
              { tx: '0x9c3...0e1', pool: 'USDC / DAI', fee: '0.05%', save: '+$0.40', status: 'Stable' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-mono text-blue-400">{row.tx}</td>
                <td className="px-6 py-4 text-white font-bold">{row.pool}</td>
                <td className="px-6 py-4 text-purple-400 font-bold">{row.fee}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">{row.save}</td>
                <td className="px-6 py-4">
                   <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">
                    {row.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
