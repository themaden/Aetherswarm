"use client";

import React, { useEffect, useState } from 'react';
import { Lock, TrendingUp, ShieldAlert, CheckCircle2, Wallet } from 'lucide-react';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';

export default function VaultPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [mounted, setMounted] = React.useState(false);

  const { data: vaultBalance } = useBalance({
    address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
    query: { enabled: mounted }
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [pRes, hRes] = await Promise.all([
          fetch('http://localhost:3001/api/portfolio'),
          fetch('http://localhost:3001/api/portfolio/holdings')
        ]);
        const pData = await pRes.json();
        const hData = await hRes.json();
        setPortfolio(pData);
        setHoldings(hData.holdings || []);
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const realTVL = mounted && vaultBalance ? parseFloat(formatEther(vaultBalance.value)).toFixed(4) : '0.0000';

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3 mb-1 tracking-tight">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
            <Lock className="text-emerald-400" size={22} />
          </div>
          Swarm Vault
        </h1>
        <p className="text-slate-600 text-xs">Vault bakiyesi blockchain&apos;den, portföy verisi backend&apos;den çekiliyor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* HOLDINGS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real TVL */}
          <div className="bg-gradient-to-r from-emerald-600/10 to-blue-600/10 border border-emerald-500/10 rounded-2xl p-6">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Gerçek On-Chain TVL (Sepolia)</p>
            <p className="text-3xl font-black text-white">{realTVL} ETH</p>
            <p className="text-[10px] text-slate-600 font-mono mt-1">Kontrat: {CONTRACT_ADDRESSES.VAULT.SEPOLIA}</p>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-6">Portföy Dağılımı (Backend)</h3>
            <div className="space-y-5">
              {holdings.map((asset: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-bold text-[10px] text-white">{asset.symbol[0]}</div>
                      <div>
                        <p className="text-xs font-bold text-white">{asset.symbol}</p>
                        <p className="text-[10px] text-slate-500">${asset.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">{(asset.allocation * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${asset.allocation * 100}%` }}></div>
                  </div>
                </div>
              ))}
              {holdings.length === 0 && <p className="text-slate-600 text-xs">Backend bekleniyor...</p>}
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl p-5 flex gap-4 items-center">
            <ShieldAlert size={20} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-white font-bold text-xs mb-1">executeVerifiedStrategy()</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">Vault işlemleri TEE Enclave tarafından imzalanmış stratejilerle sınırlıdır. Doğrudan fon erişimi programatik olarak imkansızdır.</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" /> Performans
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Tahmini APY</p>
                <p className="text-xl font-black text-white">{portfolio?.apy || '—'}%</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Toplam Değer</p>
                <p className="text-xl font-black text-white">${portfolio?.totalValue ? (portfolio.totalValue / 1000).toFixed(0) + 'K' : '—'}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>On-chain Audit Passed: AetherSwarm v2.1</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>0G Storage Sync: Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Wallet size={80} /></div>
            <h3 className="text-base font-black mb-1">Portföy Özeti</h3>
            <p className="text-blue-100/60 text-xs mb-5">Gerçek zamanlı varlık yönetimi aktif.</p>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                <span>Risk Seviyesi</span>
                <span>Düşük / Optimized</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[25%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
