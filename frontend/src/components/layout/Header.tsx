"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, Shield, ChevronDown, LogOut, Radio } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Header() {
  const { address: account, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (addr: string) => `${addr.slice(0, 6)}···${addr.slice(-4)}`;

  // Wallet-dependent values — only use after mount to avoid hydration mismatch
  const walletConnected = mounted && !!account;
  const walletConnecting = mounted && isConnecting;
  const walletLabel = !mounted ? 'Connect Wallet' : walletConnecting ? 'Connecting...' : walletConnected ? fmt(account!) : 'Connect Wallet';

  return (
    <header className="h-[72px] border-b flex items-center justify-between px-7 z-30 relative shrink-0"
      style={{
        background: 'rgba(2,2,5,0.85)',
        borderColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
      }}>

      {/* Glow line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

      {/* ── LEFT ── */}
      <div className="flex items-center gap-5">
        {/* Live clock */}
        <div className="font-mono text-[11px] text-slate-700 tracking-widest hidden lg:block">
          {time}
        </div>

        <div className="w-px h-4 bg-white/[0.06] hidden lg:block" />

        {/* Security status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04]">
          <Shield size={12} className="text-emerald-400" />
          <span className="text-[10px] text-emerald-400/70 font-bold tracking-wider uppercase">TEE Enclave Active</span>
        </div>

        {/* Broadcast indicator */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-700">
          <Radio size={12} className="text-purple-500 animate-pulse" />
          <span className="font-mono">Gensyn<span className="text-purple-500"> AXL</span> · Online</span>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-3">
        {/* Network */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[10px] text-slate-600 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
          Sepolia · 11155111
        </div>

        {/* Wallet */}
        <div className="relative">
          <button
            onClick={() => walletConnected ? setShowDropdown(s => !s) : connect({ connector: injected() })}
            disabled={walletConnecting}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all active:scale-[0.97] overflow-hidden group"
            style={{
              background: walletConnected
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(16,185,129,0.8))',
              border: walletConnected ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              boxShadow: walletConnected ? 'none' : '0 4px 24px rgba(59,130,246,0.25)',
            }}
          >
            {/* Shimmer on gradient */}
            {!walletConnected && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
            <Wallet size={14} className="relative z-10 shrink-0" />
            <span className="relative z-10">{walletLabel}</span>
            {walletConnected && <ChevronDown size={12} className={`relative z-10 opacity-50 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />}
          </button>

          {walletConnected && showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-44 rounded-xl border border-white/[0.08] shadow-2xl z-50 overflow-hidden"
              style={{ background: 'rgba(4,4,10,0.98)', backdropFilter: 'blur(20px)' }}>
              <div className="px-4 py-3 border-b border-white/[0.05]">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-0.5">Connected</p>
                <p className="text-[11px] text-white font-mono">{fmt(account!)}</p>
              </div>
              <button onClick={() => { disconnect(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors">
                <LogOut size={13} /> Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}