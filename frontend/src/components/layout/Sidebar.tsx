"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, ImageIcon, Zap, Vault, Activity } from 'lucide-react';

const navItems = [
  { name: 'Command Center', path: '/',          icon: LayoutDashboard, tag: 'LIVE' },
  { name: 'Ghost Swarm',    path: '/swarm',     icon: Network,         tag: 'P2P' },
  { name: 'iNFT Vault',     path: '/gallery',   icon: ImageIcon,       tag: 'ERC-7857' },
  { name: 'Hook Engine',    path: '/execution', icon: Zap,             tag: 'UNI v4' },
  { name: 'Vault Capital',  path: '/vault',     icon: Vault,           tag: 'TEE' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col z-50"
      style={{ background: 'rgba(2,2,5,0.96)', borderRight: '1px solid rgba(255,255,255,0.045)' }}>

      {/* ── LOGO ── */}
      <div className="h-[72px] flex items-center px-5 border-b border-white/[0.04] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.06] to-transparent" />
        <div className="relative z-10 flex items-center gap-3">
          {/* Hex logo */}
          <div className="relative w-9 h-9 shrink-0">
            <div className="clip-hex w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 animate-pulse-glow" />
            <Zap size={16} className="absolute inset-0 m-auto text-white" />
          </div>
          <div>
            <div className="text-[15px] font-black text-white tracking-tight leading-none">
              AETHER<span className="gradient-text-blue">SWARM</span>
            </div>
            <div className="text-[8px] font-bold tracking-[0.2em] text-slate-600 uppercase mt-0.5">
              Ghost Swarm Protocol
            </div>
          </div>
        </div>
      </div>

      {/* ── SYSTEM PULSE ── */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2.5 rounded-xl border border-emerald-500/[0.12] bg-emerald-500/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-[ping_1.5s_ease-in-out_infinite] opacity-40" />
          </div>
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">All Systems Nominal</span>
        </div>
        <Activity size={11} className="text-emerald-500/60 animate-pulse" />
      </div>

      {/* ── NAV LABEL ── */}
      <div className="px-5 pt-3 pb-1">
        <span className="text-[8px] font-bold tracking-[0.25em] text-slate-700 uppercase">Navigation</span>
      </div>

      {/* ── NAV ITEMS ── */}
      <nav className="flex-1 px-3 space-y-0.5 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-200'
              }`}
                style={isActive ? {
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.1), rgba(16,185,129,0.04))',
                  borderLeft: '2px solid rgba(59,130,246,0.5)',
                } : {}}
              >
                {/* Hover bg */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/[0] group-hover:bg-white/[0.02] transition-colors rounded-xl" />
                )}

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}

                <Icon size={17} className={`shrink-0 transition-all duration-200 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400 group-hover:scale-110'}`} />

                <span className="text-[12px] font-semibold flex-1">{item.name}</span>

                {/* Tag badge */}
                <span className={`text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                  isActive
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-slate-700 group-hover:border-white/[0.12] group-hover:text-slate-500'
                }`}>{item.tag}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── FOOTER STATS ── */}
      <div className="p-3 border-t border-white/[0.04] space-y-2">
        <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider mb-1.5">
            <span className="text-slate-700">0G Labs TEE</span>
            <span className="text-cyan-500">Sealed</span>
          </div>
          <div className="h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
          </div>
        </div>
        <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider mb-1.5">
            <span className="text-slate-700">Gensyn AXL Mesh</span>
            <span className="text-purple-500">5 Nodes</span>
          </div>
          <div className="h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[80%] bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
          </div>
        </div>
        <div className="text-center py-1">
          <span className="text-[7px] text-slate-800 font-mono">AetherSwarm v2.1 • Sepolia</span>
        </div>
      </div>
    </aside>
  );
}
