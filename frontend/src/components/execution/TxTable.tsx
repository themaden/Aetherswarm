'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

interface Transaction {
  id: string;
  pair: string;
  amount: string;
  fee: string;
  status: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
}

export default function TxTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchApi<TransactionsResponse>(API_ENDPOINTS.TRANSACTIONS);

        if (isMounted) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load transactions'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2.5 text-sm">
        <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/10">
          <ArrowRightLeft size={14} className="text-blue-400" />
        </div>
        Recent Hook Swaps
      </h3>

      {isLoading && (
        <div className="text-sm text-slate-500 border border-white/[0.06] bg-white/[0.02] rounded-xl p-5">
          Loading hook swaps...
        </div>
      )}

      {!isLoading && error && (
        <div className="text-sm text-red-300 border border-red-500/10 bg-red-500/[0.04] rounded-xl p-5">
          Execution API is unavailable.
        </div>
      )}

      {!isLoading && !error && (
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
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 group">
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
          {transactions.length === 0 && (
            <tr><td colSpan={4} className="py-8 text-center text-slate-700 text-xs">No hook executions yet. Waiting for AI loop trigger...</td></tr>
          )}
        </tbody>
      </table>
      )}
    </div>
  );
}
