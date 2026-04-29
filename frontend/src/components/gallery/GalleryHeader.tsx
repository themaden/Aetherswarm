import React from 'react';
import { Fingerprint } from 'lucide-react';

export default function GalleryHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Fingerprint className="text-emerald-500" size={32} />
          iNFT Registry
        </h1>
        <p className="text-slate-500 mt-1">ERC-7857 Intelligent NFT instances managed by 0G Storage.</p>
      </div>
      <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-500 text-xs font-bold uppercase">
        Total Supply: 3 Agents
      </div>
    </div>
  );
}
