"use client";

import React from 'react';
import { Wallet, Bell, Shield, ChevronDown, Wifi } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';

/**
 * @title Top Header
 * @dev Manages wallet connection, network status, and system notifications.
 */
export default function Header() {
  const { account, connectWallet, formatAddress } = useWeb3();

  return (
    <header className="h-20 border-b border-white/[0.06] bg-[#030308]/60 backdrop-blur-2xl flex items-center justify-between px-8 z-20 relative">
      
      {/* Subtle bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      {/* LEFT: SYSTEM STATUS */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-emerald-500/[0.08] border border-emerald-500/[0.12] px-4 py-2 rounded-xl">
          <div className="relative">
            <Shield size={14} className="text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            System Security: <span className="text-emerald-400 font-bold">Optimal</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
          <Wifi size={12} className="text-blue-400" />
          <span>Latency: <span className="text-blue-400 font-semibold">12ms</span></span>
        </div>
      </div>

      {/* RIGHT: ACTIONS & WALLET */}
      <div className="flex items-center gap-4">
        
        {/* NOTIFICATIONS */}
        <button className="relative p-2.5 text-slate-500 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>

        {/* NETWORK BADGE */}
        <div className="hidden md:flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:border-purple-500/30 transition-colors duration-200">
          <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.7)]"></div>
          Sepolia Testnet
        </div>

        {/* WALLET CONNECT BUTTON */}
        <button
          onClick={connectWallet}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.97] group relative overflow-hidden"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <Wallet size={15} className="group-hover:rotate-12 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">{account ? formatAddress(account) : "Connect Wallet"}</span>
          {account && <ChevronDown size={13} className="ml-0.5 opacity-60 relative z-10" />}
        </button>

      </div>
    </header>
  );
}