// frontend/src/app/page.tsx (Havalı Versiyon)
"use client";
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

export default function AetherSwarmDashboard() {
  const { account, connectWallet, isConnecting, formatAddress } = useWeb3();
  const [swarmHealth, setSwarmHealth] = useState(98);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black text-green-400 p-6 font-mono selection:bg-green-500 selection:text-black">
      
      {/* TOP BAR: SYSTEM STATUS */}
      <div className="flex justify-between items-center mb-8 bg-black/40 backdrop-blur-md border border-green-500/20 p-4 rounded-xl shadow-neon">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
          </div>
          <h1 className="text-2xl font-black tracking-widest uppercase">Aether_Swarm <span className="text-[10px] text-green-700 font-normal">v1.0.4-Alpha</span></h1>
        </div>
        
        <button 
          onClick={connectWallet}
          className="group relative px-6 py-2 border border-green-500 overflow-hidden transition-all hover:shadow-neon"
        >
          <span className="relative z-10 text-sm">{account ? formatAddress(account) : "INIT_HANDSHAKE"}</span>
          <div className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        </button>
      </div>

      {/* GRID: ANALYTICS & AGENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* VAULT CARD */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-green-500/50 transition-colors">
          <h3 className="text-xs text-green-600 mb-4 tracking-[0.2em] underline decoration-green-900 underline-offset-8 font-bold">CORE_VAULT</h3>
          <div className="text-5xl font-extrabold text-white mb-2">$14.2K</div>
          <div className="flex items-center text-xs gap-2 text-green-500">
            <span>↑ 2.4%</span>
            <div className="h-1 w-20 bg-green-900 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-2/3"></div>
            </div>
          </div>
        </div>

        {/* AGENT STATUS GRID */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "ANALYZER_01", status: "SCANNING", color: "bg-blue-500" },
            { name: "EXECUTOR_01", status: "IDLE", color: "bg-green-500" },
            { name: "SENTINEL_HOOK", status: "PROTECTING", color: "bg-purple-500" }
          ].map((agent, i) => (
            <div key={i} className="bg-black/40 border border-green-500/10 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-green-800 font-bold">{agent.name}</p>
                <p className="text-sm font-bold text-gray-300">{agent.status}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${agent.color} shadow-[0_0_8px_rgba(34,197,94,0.5)]`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONSOLE AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TERMINAL LOGS */}
        <div className="lg:col-span-2 bg-black border border-green-500/20 rounded-2xl p-4 h-[400px] relative overflow-hidden group">
           <div className="flex justify-between items-center mb-4 border-b border-green-900 pb-2">
              <span className="text-[10px] opacity-50 tracking-widest uppercase">Encryption: AES-256 Enabled</span>
              <span className="text-[10px] opacity-50">Node: US-EAST-1</span>
           </div>
           <div className="space-y-2 text-[12px] font-light overflow-y-auto h-full pr-4 pb-8">
              <p className="text-green-800">[{new Date().toLocaleTimeString()}] System link established...</p>
              <p className="text-white font-bold">{`> [0G-Labs]`} Remote Attestation Verified: 0x82f...3c9</p>
              <p className="text-blue-400">{`> [Uniswap-v4]`} Sentinel Hook active. Monitoring LVR threats.</p>
              <p className="text-red-500 animate-pulse">{`> [WARNING]`} Toxic flow detected. Dynamic fee adjusted to 0.8%.</p>
              <p className="text-green-400">{`> [Swarm]`} All agents synchronized via Gensyn AXL.</p>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>

        {/* DEPOSIT CONTROL BOX */}
        <div className="bg-green-500 rounded-2xl p-1 shadow-neon transform transition-transform hover:scale-[1.02]">
          <div className="bg-black h-full w-full rounded-[14px] p-6">
            <h2 className="text-lg font-black mb-6">INJECT_CAPITAL</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-green-800 font-bold ml-1">ASSET_TYPE</label>
                <div className="w-full bg-green-500/5 border border-green-500/30 p-3 text-sm">USDC (Testnet)</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-green-800 font-bold ml-1">AMOUNT</label>
                <input type="number" placeholder="0.00" className="w-full bg-transparent border-b-2 border-green-500/30 py-4 text-3xl font-black outline-none focus:border-green-500 transition-colors" />
              </div>
              <button className="w-full bg-green-500 text-black font-black py-4 mt-4 hover:bg-green-400 transition-all active:scale-95 uppercase tracking-widest">
                Authorize_Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}