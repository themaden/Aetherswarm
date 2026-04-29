import { useMemo } from 'react';

interface iNFTBalance {
  address: string;
  count: number;
  agents: Array<{ id: string; name: string }>;
}

export function useINFTBalance(address?: string) {
  const balance = useMemo<iNFTBalance | null>(() => {
    if (!address) {
      return null;
    }

    return {
      address,
      count: 3,
      agents: [
        { id: '001', name: 'Aether_Prime' },
        { id: '002', name: 'LVR_Sentinel' },
        { id: '003', name: 'Liquidity_Seeker' },
      ],
    };
  }, [address]);

  return { balance, isLoading: false, error: null };
}
