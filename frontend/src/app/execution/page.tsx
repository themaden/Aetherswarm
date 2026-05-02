"use client";

import React, { useEffect, useState } from 'react';
import { Zap, ShieldCheck, Activity, BarChart3 } from 'lucide-react';

export default function ExecutionPage() {
  const [hookStatus, setHookStatus] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hookRes, txRes] = await Promise.all([
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/transactions')
        ]);
        const hookData = await hookRes.json();
        const txData = await txRes.json();
        setHookStatus(hookData.hook);
        setTransactions(txData.transactions || []);
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3 mb-1 tracking-tight">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/10">
            <Zap className="text-purple-400" size={22} />
          </div>
          Uniswap v4 Execution Engine
        </h1>
        <p className="text-slate-600 text-xs">Hook verileri backend API&apos;den canlı olarak çekiliyor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOOK STATUS */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={80} /></div>
          <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-4">Hook Controller</h3>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-black text-white">{hookStatus?.name || '—'}</p>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <Activity size={10} /> {hookStatus?.status || 'Bekleniyor...'}
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.05] space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Protection Mode</span>
                <span className="text-white font-mono">{hookStatus?.protectionMode || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dynamic Fee</span>
                <span className="text-purple-400 font-bold font-mono">{hookStatus?.dynamicFee || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="lg:col-span-2 bg-black/40 border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-400" /> Fee Volatility
            </h3>
            <span className="text-[10px] text-slate-600 font-mono">Real-time</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 40].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${i === 8 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] text-slate-600 font-bold uppercase">
            <span>T-12h</span>
            <span className="text-purple-400">Peak (Hook Active)</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.06]">
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-[10px]">Transaction</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-[10px]">Pool</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-[10px]">Amount</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-[10px]">Fee</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {transactions.length > 0 ? transactions.map((row: any) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-blue-400">{row.id}</td>
                <td className="px-6 py-4 text-white font-bold">{row.pair}</td>
                <td className="px-6 py-4 text-slate-300 font-mono">{row.amount}</td>
                <td className="px-6 py-4 text-purple-400 font-bold">{row.fee}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${row.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-600 text-xs">Backend bekleniyor...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
