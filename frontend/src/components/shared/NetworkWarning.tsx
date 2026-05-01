'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { AlertTriangle, Wifi } from 'lucide-react';

export default function NetworkWarning() {
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null if not mounted or not connected
  if (!mounted || !isConnected) return null;

  // 11155111 is Sepolia Chain ID
  const isWrongNetwork = chain?.id !== 11155111;

  if (!isWrongNetwork) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-[#0a0a0f] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl shadow-red-500/10 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 blur-[60px] rounded-full"></div>

        <div className="flex justify-center mb-6 relative">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Unsupported Network</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          AetherSwarm is currently deployed on the <strong className="text-emerald-400">Sepolia Testnet</strong>. Please switch your wallet network to continue interacting with the Swarm.
        </p>

        <button
          onClick={() => switchChain({ chainId: 11155111 })}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-[0.98]"
        >
          <Wifi size={18} /> Switch to Sepolia
        </button>
      </div>
    </div>
  );
}
