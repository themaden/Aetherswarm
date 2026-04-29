"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Wallet, Zap, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function AetherSwarmPremium() {
  const { account, connectWallet, isConnecting, formatAddress } = useWeb3();
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">AETHER<span className="text-blue-500">SWARM</span></span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Protocol Active</span>
            </div>
          </div>
        </div>

        <button 
          onClick={connectWallet}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all group"
        >
          <Wallet size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold">{account ? formatAddress(account) : "Connect Wallet"}</span>
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto p-8">
        
        {/* HEADER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Vault TVL" value="$1,240,432" change="+12.5%" icon={<Activity className="text-blue-500" />} />
          <StatCard title="Active Agents" value="12 Nodes" change="Stable" icon={<Cpu className="text-emerald-500" />} />
          <StatCard title="Security Level" value="TEE-Verified" change="Lvl 4" icon={<ShieldCheck className="text-purple-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: TERMINAL & MONITOR */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <TerminalIcon size={18} className="text-blue-500" />
                  Live Intelligence Feed
                </h3>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></span>
                </div>
              </div>
              <div className="space-y-4 h-64 overflow-y-auto font-mono text-sm custom-scrollbar">
                <LogEntry time="14:02:01" type="system" text="Sealed Inference session initialized via 0G Labs." />
                <LogEntry time="14:02:15" type="success" text="Remote Attestation verified. Enclave signature: 0x82f...3c9" />
                <LogEntry time="14:03:02" type="warning" text="Volatility spike detected on Uniswap v4 ETH/USDC pool." />
                <LogEntry time="14:03:05" type="action" text="SwarmHook: Adjusting dynamic fee to mitigate LVR risk." />
              </div>
            </section>

            {/* AGENT FLEET DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AgentCard name="Centinel_01" role="Analysis" status="Active" />
              <AgentCard name="Executor_Alpha" role="Execution" status="Active" />
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIONS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-emerald-500/20 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={120} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Supply Assets</h2>
              <p className="text-slate-400 text-sm mb-8">Contribute to the swarm intelligence pool and earn yield.</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500 font-bold uppercase">Amount in USDC</span>
                    <span className="text-blue-400 font-bold">MAX</span>
                  </div>
                  <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-bold text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                
                <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                  Authorize Deposit <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// HELPER COMPONENTS
function StatCard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/[0.05] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${change.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{change}</span>
      </div>
      <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function LogEntry({ time, type, text }: any) {
  const colors: any = {
    system: "text-slate-500",
    success: "text-emerald-400",
    warning: "text-amber-400",
    action: "text-blue-400"
  };
  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-[10px] text-slate-700 font-bold mt-1">[{time}]</span>
      <span className={`text-xs ${colors[type] || 'text-slate-300'}`}>{text}</span>
    </div>
  );
}

function AgentCard({ name, role, status }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
          <Cpu size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{role}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{status}</span>
    </div>
  );
}