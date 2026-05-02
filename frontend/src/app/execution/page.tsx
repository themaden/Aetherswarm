"use client";

import React, { useEffect, useState } from 'react';
import { Zap, ShieldCheck, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function HookEnginePage() {
  const [hook, setHook] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [hr, tr] = await Promise.all([
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/transactions'),
        ]);
        setHook((await hr.json()).hook);
        setTxs((await tr.json()).transactions || []);
      } catch { /* */ }
    };
    fetch_();
    const iv = setInterval(fetch_, 4000);
    return () => clearInterval(iv);
  }, []);

  /* Simulated fee history bars */
  const bars = [42, 68, 51, 88, 62, 95, 71, 44, 83, 55, 77, 60, 91, 48, 72];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="fade-in-up">
        <div className="text-[9px] font-bold tracking-[0.2em] text-slate-700 uppercase mb-2">Uniswap v4 · SwarmHook</div>
        <h1 className="text-2xl font-black text-white tracking-tight">Hook <span className="gradient-text-blue">Engine</span></h1>
        <p className="text-xs text-slate-600 mt-1">Dynamic fee management · LVR protection · MEV defense · On-chain execution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 fade-in-up fade-in-up-1">

        {/* HOOK STATUS */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-6 hover-lift">
          <div className="absolute right-4 top-4 opacity-[0.04]"><Zap size={80} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Hook Controller</span>
            </div>
            <p className="text-2xl font-black text-white mb-1">{hook?.name ?? '—'}</p>
            <div className="space-y-3 mt-4 pt-4 border-t border-white/[0.05]">
              <InfoRow label="Status"     val={hook?.status ?? '—'}          valColor="text-emerald-400" />
              <InfoRow label="Mode"       val={hook?.protectionMode ?? '—'}  valColor="text-blue-400"    />
              <InfoRow label="Dynamic Fee" val={hook?.dynamicFee ?? '—'}     valColor="text-amber-400"   />
            </div>
          </div>
        </div>

        {/* STRATEGY CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <ShieldCheck size={20} className="text-cyan-400" />, title: 'LVR Defense', body: 'Fees adjust dynamically with volatility to recapture arbitrage value.', color: 'border-cyan-500/10' },
            { icon: <TrendingUp  size={20} className="text-emerald-400" />, title: 'Take-Profit', body: 'On-chain limit orders execute at pool level without external keepers.', color: 'border-emerald-500/10' },
            { icon: <ShieldCheck size={20} className="text-red-400" />, title: 'MEV Shield', body: 'beforeSwap checks block sandwich attacks before state changes.', color: 'border-red-500/10' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border ${s.color} bg-white/[0.018] p-4 hover-lift`}>
              <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.05] w-fit mb-3">{s.icon}</div>
              <p className="text-xs font-black text-white mb-1">{s.title}</p>
              <p className="text-[10px] text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEE CHART */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.018] p-6 fade-in-up fade-in-up-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 size={16} className="text-blue-400" />
            <span className="text-sm font-black text-white">Fee Volatility Index</span>
          </div>
          <span className="text-[9px] text-slate-700 font-mono uppercase tracking-wider">24h window</span>
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm transition-all duration-700"
                style={{
                  height: `${h}%`,
                  background: i === 5 || i === 12
                    ? 'linear-gradient(180deg, #3b82f6, #0ea5e9)'
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: i === 5 || i === 12 ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[9px] text-slate-800 font-bold uppercase tracking-wider">
          <span>T-24h</span>
          <span className="text-blue-700">● Hook Triggered</span>
          <span>Now</span>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="rounded-2xl border border-white/[0.05] overflow-hidden fade-in-up fade-in-up-3">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.012)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Executions</span>
          <span className="text-[9px] text-slate-700 font-mono">{txs.length} records</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/[0.03]">
              {['ID', 'Pool', 'Amount', 'Fee', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txs.map((tx: any) => (
              <tr key={tx.id} className="border-b border-white/[0.025] hover:bg-white/[0.015] transition-colors">
                <td className="px-5 py-3.5 font-mono text-blue-400">{tx.id}</td>
                <td className="px-5 py-3.5 font-bold text-white">{tx.pair}</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{tx.amount}</td>
                <td className="px-5 py-3.5 font-bold text-amber-400">{tx.fee}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                    tx.status === 'Confirmed'
                      ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20'
                  }`}>
                    {tx.status === 'Confirmed' ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
            {txs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-700 text-xs">No hook executions yet. Waiting for AI loop trigger...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoRow({ label, val, valColor }: { label: string; val: string; valColor: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-600">{label}</span>
      <span className={`text-[11px] font-black font-mono ${valColor}`}>{val}</span>
    </div>
  );
}
