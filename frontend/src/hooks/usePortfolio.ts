import { useState, useEffect } from 'react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

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
    let isMounted = true;

    async function loadPortfolio() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchApi<PortfolioData>(API_ENDPOINTS.PORTFOLIO);

        if (isMounted) {
          setPortfolio(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load portfolio'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  return { portfolio, isLoading, error };
}
