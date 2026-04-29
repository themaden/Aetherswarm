'use client';

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface Transaction {
  pair: string;
  amount: string;
  fee: string;
  status: string;
}

const TRANSACTIONS: Transaction[] = [
  { pair: 'ETH / USDC', amount: '12.5 ETH', fee: '0.35%', status: 'Confirmed' },
  { pair: 'WBTC / USDC', amount: '0.8 BTC', fee: '0.42%', status: 'Confirmed' },
  { pair: 'USDC / DAI', amount: '50,000 USDC', fee: '0.05%', status: 'Pending' },
];

export default function TxTable() {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <ArrowRightLeft size={18} className="text-blue-500" /> Recent Hook Swaps
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-slate-500 border-b border-white/5 uppercase tracking-widest">
            <th className="pb-4">Asset Pair</th>
            <th className="pb-4">Amount</th>
            <th className="pb-4">Dynamic Fee</th>
            <th className="pb-4">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {TRANSACTIONS.map((tx, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-4 text-white font-bold">{tx.pair}</td>
              <td className="py-4 text-slate-400">{tx.amount}</td>
              <td className="py-4 text-emerald-500 font-mono">{tx.fee}</td>
              <td className="py-4 text-xs text-blue-500 font-bold underline">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
