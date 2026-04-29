"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import TxTable from '@/components/execution/TxTable';
import LVRProtectionPanel from '@/components/execution/LVRProtectionPanel';

export default function ExecutionPage() {
  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="fade-in-up">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
            <Zap className="text-blue-400" size={28} />
          </div>
          Execution Engine
        </h1>
        <p className="text-slate-500 mt-2 text-sm">Uniswap v4 Hook activity and dynamic LVR protection logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRANSACTION TABLE */}
        <div className="lg:col-span-2 fade-in-up fade-in-up-1">
          <TxTable />
        </div>

        {/* LVR PROTECTION PANEL */}
        <div className="fade-in-up fade-in-up-2">
          <LVRProtectionPanel />
        </div>
      </div>
    </div>
  );
}
