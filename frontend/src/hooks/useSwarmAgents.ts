import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  status: string;
  location: string;
}

export function useSwarmAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    setAgents([
      { id: '1', name: 'Node Alpha', status: 'Active', location: 'US-East' },
      { id: '2', name: 'Node Beta', status: 'Active', location: 'EU-Central' },
      { id: '3', name: 'Node Gamma', status: 'Idle', location: 'AP-South' },
    ]);
    setIsLoading(false);
  }, []);

  return { agents, isLoading, error };
}
