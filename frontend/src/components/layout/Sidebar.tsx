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
    <aside className="w-64 bg-black/40 border-r border-white/5 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0">
      {/* BRANDING */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">AETHER<span className="text-blue-500">SWARM</span></span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
                {item.icon}
                <span className="text-sm font-semibold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / SYSTEM STATUS */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-xs text-white font-bold">TEE Enclave</p>
            <p className="text-[10px] text-slate-500">0G Labs Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}