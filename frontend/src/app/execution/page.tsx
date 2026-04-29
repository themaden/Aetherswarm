"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import TxTable from '@/components/execution/TxTable';
import LVRProtectionPanel from '@/components/execution/LVRProtectionPanel';

export default function ExecutionPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Zap className="text-blue-500" size={32} />
          Execution Engine
        </h1>
        <p className="text-slate-500">Uniswap v4 Hook activity and dynamic LVR protection logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRANSACTION TABLE */}
        <div className="lg:col-span-2">
          <TxTable />
        </div>

        {/* LVR PROTECTION PANEL */}
        <LVRProtectionPanel />
      </div>
    </div>
  );
}
