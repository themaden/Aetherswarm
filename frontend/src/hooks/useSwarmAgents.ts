import { useState, useEffect } from 'react';
import { API_ENDPOINTS, fetchApi } from '@/lib/api';

export interface Agent {
  id: string;
  name: string;
  role?: string;
  status: string;
  location: string;
}

interface AgentsResponse {
  agents: Agent[];
}

export function useSwarmAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAgents() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchApi<AgentsResponse>(API_ENDPOINTS.AGENTS);

        if (isMounted) {
          setAgents(data.agents);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load swarm agents'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAgents();

    return () => {
      isMounted = false;
    };
  }, []);

  return { agents, isLoading, error };
}
