'use client';

import React from 'react';
import { ShieldAlert, TrendingDown, Gauge } from 'lucide-react';

export default function LVRProtectionPanel() {
  return (
    <div className="bg-gradient-to-br from-red-500/[0.06] to-transparent border border-red-500/[0.12] rounded-2xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
        <ShieldAlert size={80} />
      </div>
      
      <div className="flex items-center gap-2.5 text-red-400 font-bold mb-5 uppercase text-[10px] tracking-wider">
        <div className="p-1.5 bg-red-500/10 rounded-lg border border-red-500/10">
          <ShieldAlert size={14} />
        </div>
        LVR Protection Active
      </div>
      <p className="text-slate-400 text-xs mb-6 leading-relaxed">The SwarmHook is monitoring toxic order flow to prevent Loss-Versus-Rebalancing.</p>
      <div className="space-y-3">
        <div className="bg-black/30 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={10} className="text-slate-600" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Blocked Arbitrage Profit</p>
          </div>
          <p className="text-xl font-extrabold text-white">$432.12</p>
        </div>
        <div className="bg-black/30 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge size={10} className="text-slate-600" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Hook Gas Efficiency</p>
          </div>
          <p className="text-xl font-extrabold text-white">92% <span className="text-[10px] text-slate-600 font-semibold">(T-Storage)</span></p>
        </div>
      </div>
    </div>
  );
}
