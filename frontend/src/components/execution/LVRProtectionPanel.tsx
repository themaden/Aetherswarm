'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function LVRProtectionPanel() {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
      <div className="flex items-center gap-2 text-red-500 font-bold mb-4 uppercase text-xs tracking-tighter">
        <ShieldAlert size={16} /> LVR Protection Active
      </div>
      <p className="text-slate-400 text-sm mb-6">The SwarmHook is monitoring toxic order flow to prevent Loss-Versus-Rebalancing.</p>
      <div className="space-y-4">
        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase">Blocked Arbitrage Profit</p>
          <p className="text-xl font-black text-white">$432.12</p>
        </div>
        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase">Hook Gas Efficiency</p>
          <p className="text-xl font-black text-white">92% (T-Storage)</p>
        </div>
      </div>
    </div>
  );
}
