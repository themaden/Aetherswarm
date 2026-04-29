import { useState, useEffect } from 'react';

interface PortfolioData {
  totalValue: number;
  dayChange: number;
  allocation: Record<string, number>;
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    setPortfolio({
      totalValue: 1250000,
      dayChange: 4.2,
      allocation: {
        ETH: 0.35,
        USDC: 0.45,
        DAI: 0.15,
        Other: 0.05,
      },
    });
    setIsLoading(false);
  }, []);

  return { portfolio, isLoading, error };
}
