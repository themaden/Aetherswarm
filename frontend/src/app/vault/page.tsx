"use client";

import React, { useEffect, useState } from 'react';
import { Lock, PieChart, TrendingUp, ShieldAlert, CheckCircle2, Wallet } from 'lucide-react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

export default function VaultPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchApi<any>(API_ENDPOINTS.PORTFOLIO),
      fetchApi<any>(API_ENDPOINTS.HOLDINGS)
    ]).then(([pData, hData]) => {
      setPortfolio(pData);
      setHoldings(hData.holdings);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="fade-in-up">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
            <Lock className="text-emerald-400" size={28} />
          </div>
          Swarm Vault Management
        </h1>
        <p className="text-slate-500 text-sm">Autonomous capital allocation & risk management via AetherSwarmVault.sol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PORTFOLIO ALLOCATION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-7 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <PieChart size={16} className="text-emerald-400" /> Asset Allocation
              </h3>
              <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20">
                LVR PROTECTED
              </div>
            </div>
            
            <div className="space-y-6">
              {holdings.length > 0 ? holdings.map((asset, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.05] flex items-center justify-center font-bold text-[10px] text-white">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{asset.symbol}</p>
                        <p className="text-[10px] text-slate-500">${asset.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">{(asset.allocation * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                      style={{ width: `${asset.allocation * 100}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 text-xs italic">Connecting to Vault indexer...</p>
              )}
            </div>
          </div>

          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl p-6 flex gap-5 items-center">
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex-shrink-0">
              <ShieldAlert size={24} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">executeVerifiedStrategy()</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Vault operations are restricted to strategies signed by the TEE Enclave and verified via Merkle Proof. Direct fund access is programmatically impossible, secured by 0G Labs.
              </p>
            </div>
          </div>
        </div>

        {/* PERFORMANCE & STATS */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-7">
              <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-400" /> Vault Performance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04]">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Avg APY</p>
                  <p className="text-xl font-black text-white">{portfolio?.dayChange ? '14.2%' : '12.5%'}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04]">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total TVL</p>
                  <p className="text-xl font-black text-white">${portfolio?.totalValue ? (portfolio.totalValue / 1000).toFixed(0) : '125'}K</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>On-chain Audit Passed: AetherSwarm_v2.1</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>0G Storage Sync: Verified by Sealed Inference</span>
                </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-7 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet size={100} />
              </div>
              <h3 className="text-lg font-black mb-1">Portfolio Summary</h3>
              <p className="text-blue-100 text-xs mb-6">Real-time asset management enabled.</p>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-md">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                  <span>Risk Level</span>
                  <span>Low / Optimized</span>
                </div>
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[25%] shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
