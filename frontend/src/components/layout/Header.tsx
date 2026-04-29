"use client";

import React from 'react';
import { Wallet, Bell, Shield, ChevronDown } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';

/**
 * @title Top Header
 * @dev Manages wallet connection, network status, and system notifications.
 */
export default function Header() {
  const { account, connectWallet, formatAddress } = useWeb3();

  return (
    <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-20">
      
      {/* LEFT: SYSTEM STATUS */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
         <Shield size={16} className="text-emerald-500" />
         <span>System Security: <span className="text-emerald-500 font-bold uppercase tracking-wider">Optimal</span></span>
      </div>

      {/* RIGHT: ACTIONS & WALLET */}
      <div className="flex items-center gap-5">
        
        {/* NOTIFICATIONS */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>

        {/* NETWORK BADGE */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300">
          <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div>
          Sepolia Testnet
        </div>

        {/* WALLET CONNECT BUTTON */}
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 group"
        >
          <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
          {account ? formatAddress(account) : "Connect Wallet"}
          {account && <ChevronDown size={14} className="ml-1 opacity-70" />}
        </button>

      </div>
    </header>
  );
}