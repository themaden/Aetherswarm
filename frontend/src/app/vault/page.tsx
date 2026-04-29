"use client";

import React from 'react';
import { Lock } from 'lucide-react';

export default function VaultPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
          <Lock className="text-amber-500" size={32} />
          Swarm Vault
        </h1>
        <p className="text-slate-400">Capital deposits secured by 0G Storage and TEE attestation.</p>
      </div>

      {/* COMING SOON */}
      <div className="bg-white/[0.02] border border-white/5 p-12 rounded-3xl text-center">
        <h2 className="text-2xl font-bold text-slate-400 mb-2">Vault Interface</h2>
        <p className="text-slate-500">Component structure ready for deposit forms and performance tracking.</p>
      </div>
    </div>
  );
}
