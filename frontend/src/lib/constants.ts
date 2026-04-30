/**
 * @title Smart Contract Addresses
 * @dev Deployed contract addresses on mainnet and testnets
 */

export const CONTRACT_ADDRESSES = {
  VAULT: {
    MAINNET: process.env.NEXT_PUBLIC_VAULT_MAINNET_ADDRESS || '',
    SEPOLIA: process.env.NEXT_PUBLIC_VAULT_ADDRESS || '',
  },
  NFT: {
    MAINNET: process.env.NEXT_PUBLIC_INFT_MAINNET_ADDRESS || '',
    SEPOLIA: process.env.NEXT_PUBLIC_INFT_ADDRESS || '',
  },
  HOOK: {
    MAINNET: process.env.NEXT_PUBLIC_HOOK_MAINNET_ADDRESS || '',
    SEPOLIA: process.env.NEXT_PUBLIC_HOOK_ADDRESS || '',
  },
};

/**
 * @title Chain Configuration
 */
export const CHAINS = {
  ETHEREUM: 1,
  SEPOLIA: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
};

/**
 * @title UI Constants
 */
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  POLLING_INTERVAL: 5000,
  MAX_DECIMAL_PLACES: 6,
};

/**
 * @title Fee Tiers (Uniswap v4)
 */
export const FEE_TIERS = [0.01, 0.05, 0.30, 1.0];

/**
 * @title Supported Tokens
 */
export const SUPPORTED_TOKENS = ['ETH', 'USDC', 'DAI', 'WBTC', 'USDT'];
