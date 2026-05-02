'use client';

import React, { useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import iNFTABI from '@/abis/AetherSwarmiNFT.json';
import INFTCard from './INFTCard';

export default function INFTGalleryGrid() {
  const { address: accountAddress } = useAccount();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: agentCount } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
    abi: iNFTABI,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    query: {
      enabled: mounted && !!accountAddress,
    }
  });

  const agents = useMemo(() => {
    if (!agentCount) return [];
    const count = Number(agentCount);
    return Array.from({ length: count }, (_, i) => ({
      id: `#${i.toString().padStart(3, '0')}`,
      name: `Aether_Agent_${i + 1}`,
      type: i % 2 === 0 ? 'Strategy Master' : 'Hook Guardian',
      memory: 'Encrypted State',
      health: 'Optimal',
      imageIndex: (i % 3) + 1
    }));
  }, [agentCount]);

  if (!mounted) return null;

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/[0.1] rounded-3xl">
        <p className="text-slate-500 font-medium mb-4">No AI Agents detected in this neural sector.</p>
        <a 
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors"
        >
          Go to Command Center to deploy your first agent →
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {agents.map((agent) => (
        <INFTCard
          key={agent.id}
          id={agent.id}
          name={agent.name}
          type={agent.type}
          memory={agent.memory}
          health={agent.health}
          imageIndex={agent.imageIndex}
        />
      ))}
    </div>
  );
}
