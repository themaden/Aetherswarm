/**
 * @title API Constants
 * @dev Base URL and endpoints for backend communication
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Swarm
  AGENTS: '/agents',
  AGENT_DETAIL: (id: string) => `/agents/${id}`,
  
  // Portfolio
  PORTFOLIO: '/portfolio',
  HOLDINGS: '/portfolio/holdings',
  PERFORMANCE: '/portfolio/performance',
  
  // Execution
  TRANSACTIONS: '/transactions',
  HOOK_STATUS: '/execution/hooks',
  
  // Vault
  DEPOSITS: '/vault/deposits',
  WITHDRAW: '/vault/withdraw',
  
  // TEE
  ATTESTATION: '/tee/attestation',
};

export async function fetchApi<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
