/**
 * @title Wagmi Configuration
 * @dev Wallet connection and chain configuration
 */

import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '' }),
    coinbaseWallet({ appName: 'AetherSwarm' }),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
