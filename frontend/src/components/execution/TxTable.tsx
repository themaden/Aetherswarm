'use client';

import React from 'react';
import { ArrowRightLeft, ExternalLink } from 'lucide-react';

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
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2.5 text-sm">
        <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/10">
          <ArrowRightLeft size={14} className="text-blue-400" />
        </div>
        Recent Hook Swaps
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-slate-600 border-b border-white/[0.06] uppercase tracking-[0.12em]">
            <th className="pb-4 font-semibold">Asset Pair</th>
            <th className="pb-4 font-semibold">Amount</th>
            <th className="pb-4 font-semibold">Dynamic Fee</th>
            <th className="pb-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {TRANSACTIONS.map((tx, idx) => (
            <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 group">
              <td className="py-4 text-white font-semibold">{tx.pair}</td>
              <td className="py-4 text-slate-400 font-mono text-xs">{tx.amount}</td>
              <td className="py-4 text-emerald-400 font-mono text-xs font-semibold">{tx.fee}</td>
              <td className="py-4">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                  tx.status === 'Confirmed' 
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/10' 
                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/10'
                }`}>
                  {tx.status}
                  {tx.status === 'Confirmed' && <ExternalLink size={8} />}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
