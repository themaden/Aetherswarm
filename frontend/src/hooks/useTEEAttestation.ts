import { useState, useEffect } from 'react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

interface TEEAttestation {
  isValid: boolean;
  provider: string;
  enclave?: string;
  timestamp: number;
}

export function useTEEAttestation() {
  const [attestation, setAttestation] = useState<TEEAttestation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAttestation() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchApi<TEEAttestation>(API_ENDPOINTS.ATTESTATION);

        if (isMounted) {
          setAttestation(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load TEE attestation'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAttestation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { attestation, isLoading, error };
}
