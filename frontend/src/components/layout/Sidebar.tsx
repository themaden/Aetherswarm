// frontend/src/components/layout/Sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, Image as ImageIcon, Zap, Lock, Settings } from 'lucide-react';

/**
 * @title Main Navigation Sidebar
 * @dev Handles routing across the different modules of the AetherSwarm application.
 */
export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Swarm Intelligence', path: '/swarm', icon: <Globe size={20} /> }, // Gensyn AXL Viz
    { name: 'iNFT Gallery', path: '/gallery', icon: <ImageIcon size={20} /> }, // ERC-7857 Models
    { name: 'Execution Engine', path: '/execution', icon: <Zap size={20} /> }, // Uniswap v4 Hooks
    { name: 'Swarm Vault', path: '/vault', icon: <Lock size={20} /> }, // Capital Deposits
  ];

  return (
    <aside className="w-64 bg-[#030308]/80 border-r border-white/[0.06] backdrop-blur-2xl h-screen flex flex-col fixed left-0 top-0">
      {/* BRANDING */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-gradient-x">
            <Zap size={16} className="text-white fill-white drop-shadow-lg" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight">AETHER<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">SWARM</span></span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]"></div>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-[0.15em]">Protocol v2.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION LABEL */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Navigation</span>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 py-2 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500/[0.12] to-emerald-500/[0.06] text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.06)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}>
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                )}
                <span className={`transition-transform duration-200 ${isActive ? 'text-blue-400' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-semibold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / SYSTEM STATUS */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="bg-gradient-to-br from-emerald-500/[0.08] to-blue-500/[0.04] rounded-xl p-4 flex items-center gap-3 border border-emerald-500/10">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.7)]"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
          </div>
          <div>
            <p className="text-[11px] text-white font-bold tracking-wide">TEE Enclave</p>
            <p className="text-[9px] text-emerald-400/70 font-medium">0G Labs • Secured</p>
          </div>
        </div>
      </div>
    </aside>
  );
}