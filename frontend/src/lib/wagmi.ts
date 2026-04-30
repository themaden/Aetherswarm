/**
 * @title Wagmi Configuration
 * @dev Wallet connection and chain configuration
 */

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const mainnetRpcUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '' }),
    coinbaseWallet({ appName: 'AetherSwarm' }),
  ],
  transports: {
    [mainnet.id]: http(mainnetRpcUrl),
    [sepolia.id]: http(sepoliaRpcUrl),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
