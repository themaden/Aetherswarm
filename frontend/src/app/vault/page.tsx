"use client";

import React from 'react';
import { Lock, Shield, Coins, Clock } from 'lucide-react';

export default function VaultPage() {
  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div className="fade-in-up">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/10">
            <Lock className="text-amber-400" size={28} />
          </div>
          Swarm Vault
        </h1>
        <p className="text-slate-500 text-sm">Capital deposits secured by 0G Storage and TEE attestation.</p>
      </div>

      {/* VAULT STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-in-up fade-in-up-1">
        <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Coins size={14} className="text-amber-400" />
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">Total Deposited</h4>
          </div>
          <p className="text-2xl font-extrabold text-white">$1,240,432</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 12.5% this month</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-emerald-400" />
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">Security Score</h4>
          </div>
          <p className="text-2xl font-extrabold text-white">98/100</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">TEE Verified</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-blue-400" />
            <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">Lock Period</h4>
          </div>
          <p className="text-2xl font-extrabold text-white">30 Days</p>
          <p className="text-[10px] text-blue-400 font-semibold mt-1">Flexible withdrawal</p>
        </div>
      </div>

      {/* COMING SOON */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-12 rounded-2xl text-center relative overflow-hidden fade-in-up fade-in-up-2">
        {/* Background grid */}
        <div className="absolute inset-0 dot-grid opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/[0.04] blur-[80px] rounded-full"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-amber-500/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/10">
            <Lock size={28} className="text-amber-400/60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Vault Interface</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Deposit forms and performance tracking are being finalized. Smart contract audit in progress.</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
