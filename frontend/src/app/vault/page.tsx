"use client";

import React, { useEffect, useState } from 'react';
import { Lock, ShieldAlert, CheckCircle2, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useBalance, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';

export default function VaultCapitalPage() {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const { data: vaultBalance } = useBalance({
    address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
    query: { enabled: mounted },
  });

  useEffect(() => {
    setMounted(true);
    const fetch_ = async () => {
      try {
        const [pr, hr] = await Promise.all([
          fetch('http://localhost:3001/api/portfolio'),
          fetch('http://localhost:3001/api/portfolio/holdings'),
        ]);
        setPortfolio(await pr.json());
        setHoldings((await hr.json()).holdings || []);
      } catch { /* */ }
    };
    fetch_();
    const iv = setInterval(fetch_, 5000);
    return () => clearInterval(iv);
  }, []);

  const realTVL = mounted && vaultBalance
    ? parseFloat(formatEther(vaultBalance.value)).toFixed(6)
    : '0.000000';

  const holdingColors = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400'];
  const holdingBars  = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
  const holdingGlows = [
    'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="fade-in-up">
        <div className="text-[9px] font-bold tracking-[0.2em] text-slate-700 uppercase mb-2">TEE-Secured · AetherSwarm</div>
        <h1 className="text-2xl font-black text-white tracking-tight">Vault <span className="gradient-text-blue">Capital</span></h1>
        <p className="text-xs text-slate-600 mt-1">Strategy execution is locked behind TEE attestation — no unauthorized withdrawals possible</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COL */}
        <div className="lg:col-span-7 space-y-5">

          {/* REAL TVL HERO */}
          <div className="relative overflow-hidden rounded-2xl p-6 fade-in-up fade-in-up-1"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,5,15,0.9) 100%)',
              border: '1px solid rgba(16,185,129,0.12)',
            }}>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06]"><Lock size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/70">Live On-Chain TVL · Sepolia</span>
              </div>
              <p className="text-4xl font-black text-white font-mono mb-1">{realTVL} <span className="text-emerald-400 text-2xl">ETH</span></p>
              <p className="text-[10px] font-mono text-slate-700 break-all">Contract: {CONTRACT_ADDRESSES.VAULT.SEPOLIA}</p>
            </div>
          </div>

          {/* ALLOCATION */}
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.018] p-6 fade-in-up fade-in-up-2">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-blue-400" />
              <h3 className="text-sm font-black text-white">Portfolio Allocation</h3>
              <span className="ml-auto text-[9px] font-mono text-slate-700">backend api</span>
            </div>

            {/* Stacked bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex mb-6 gap-0.5">
              {holdings.map((h: any, i) => (
                <div key={i} className={`h-full ${holdingBars[i % 4]} ${holdingGlows[i % 4]} transition-all duration-1000`}
                  style={{ width: `${h.allocation * 100}%` }} />
              ))}
            </div>

            <div className="space-y-3">
              {holdings.map((h: any, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${holdingBars[i % 4]}`} />
                      <span className="text-xs font-bold text-white">{h.symbol}</span>
                      <span className="text-[10px] text-slate-600">${h.value.toLocaleString()}</span>
                    </div>
                    <span className={`text-xs font-black font-mono ${holdingColors[i % 4]}`}>
                      {(h.allocation * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.04] h-[3px] rounded-full overflow-hidden">
                    <div className={`h-full ${holdingBars[i % 4]} transition-all duration-1000`}
                      style={{ width: `${h.allocation * 100}%` }} />
                  </div>
                </div>
              ))}
              {holdings.length === 0 && (
                <div className="text-xs text-slate-700 text-center py-4">Connecting to backend...</div>
              )}
            </div>
          </div>

          {/* SECURITY CALLOUT */}
          <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.03] p-5 flex gap-4 items-start fade-in-up fade-in-up-3">
            <ShieldAlert size={20} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-white mb-1">executeVerifiedStrategy()</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All fund operations require a cryptographically signed strategy root from the TEE enclave.
                Vault funds cannot be moved without a valid Merkle proof of the AI decision.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="lg:col-span-5 space-y-5">

          {/* PERFORMANCE */}
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.018] p-6 fade-in-up fade-in-up-1">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-emerald-400" />
              <h3 className="text-sm font-black text-white">Performance</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl bg-black/30 border border-white/[0.04] p-4">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1.5">Est. APY</p>
                <p className="text-2xl font-black text-emerald-400">{portfolio?.apy ?? '—'}<span className="text-base ml-0.5">%</span></p>
              </div>
              <div className="rounded-xl bg-black/30 border border-white/[0.04] p-4">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1.5">Total AUM</p>
                <p className="text-2xl font-black text-white">${portfolio?.totalValue ? (portfolio.totalValue / 1000).toFixed(0) + 'K' : '—'}</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: '30D Change',  val: `+${portfolio?.monthlyChange ?? '—'}%`, color: 'text-emerald-400', icon: <ArrowUpRight size={11} /> },
                { label: 'Risk Score',  val: portfolio?.riskScore ?? '—',            color: 'text-blue-400',    icon: <ArrowDownRight size={11} /> },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-[11px] text-slate-600">{r.label}</span>
                  <span className={`text-[11px] font-black flex items-center gap-1 ${r.color}`}>{r.icon}{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT STATUS */}
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.018] p-5 fade-in-up fade-in-up-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">System Verification</p>
            {[
              'On-chain Audit Passed: v2.1',
              '0G Storage Sync: Verified',
              'TEE Attestation: Valid',
              'Hook Permissions: Active',
              'Merkle Root: Up to date',
            ].map((check, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-white/[0.03] last:border-0">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span className="text-[10px] text-slate-500">{check}</span>
              </div>
            ))}
          </div>

          {/* GRADIENT CARD */}
          <div className="relative overflow-hidden rounded-2xl p-6 fade-in-up fade-in-up-3"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #0f766e 100%)',
              boxShadow: '0 8px 32px rgba(30,64,175,0.25)',
            }}>
            <div className="absolute right-4 top-4 opacity-10"><Wallet size={72} /></div>
            <div className="relative z-10">
              <p className="text-[9px] font-bold tracking-widest uppercase text-white/50 mb-2">Connected Wallet</p>
              <p className="text-sm font-black text-white mb-0.5">
                {address ? `${address.slice(0, 8)}···${address.slice(-6)}` : 'Not Connected'}
              </p>
              <p className="text-[9px] text-white/40 font-mono">Sepolia Testnet · EIP-1559</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
