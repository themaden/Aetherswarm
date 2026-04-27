"use client"; // Next.js'e bunun kullanıcının tarayıcısında çalışacağını söylüyoruz

import React from 'react';
import { useWeb3 } from '../hooks/useWeb3'; // Yeni yazdığımız Hook'u içeri aldık

export default function AetherSwarmDashboard() {
  const { account, connectWallet, isConnecting, formatAddress } = useWeb3();

  return (
    <main className="min-h-screen bg-neutral-950 text-green-400 p-8 font-mono">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b border-green-500/30 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">AETHER_SWARM</h1>
          <p className="text-xs text-green-600">v1.0.0 // DECENTRALIZED AI FUND</p>
        </div>
        
        {/* CÜZDAN BUTONU BURADA DEĞİŞTİ! */}
        <button 
          onClick={connectWallet}
          disabled={isConnecting || account !== null}
          className="bg-green-500/10 border border-green-500 hover:bg-green-500 hover:text-black transition-colors px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "CONNECTING..." : account ? `CONNECTED: ${formatAddress(account)}` : "CONNECT_WALLET"}
        </button>
      </header>

      {/* ... KODUN GERİ KALANI AYNI KALACAK (Grid, Vault Status, Terminal vs.) ... */}
    </main>
  );
}