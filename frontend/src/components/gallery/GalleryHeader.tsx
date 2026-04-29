import React from 'react';
import { Fingerprint } from 'lucide-react';

export default function GalleryHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
            <Fingerprint className="text-emerald-400" size={28} />
          </div>
          iNFT Registry
        </h1>
        <p className="text-slate-500 mt-2 text-sm">ERC-7857 Intelligent NFT instances managed by 0G Storage.</p>
      </div>
      <div className="bg-emerald-500/[0.08] border border-emerald-500/[0.15] px-4 py-2.5 rounded-xl text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
        Total Supply: 3 Agents
      </div>
    </div>
  );
}
