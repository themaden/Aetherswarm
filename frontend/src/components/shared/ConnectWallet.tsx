'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

export default function ConnectWallet() {
  const handleConnect = async () => {
    // This will integrate with wagmi later
    console.log('Connect wallet clicked');
  };

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all shadow-lg"
    >
      <Wallet size={18} />
      <span>Connect Wallet</span>
    </button>
  );
}
