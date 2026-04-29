/**
 * @title Smart Contract Addresses
 * @dev Deployed contract addresses on mainnet and testnets
 */

export const CONTRACT_ADDRESSES = {
  VAULT: {
    MAINNET: '0x...',
    SEPOLIA: '0x...',
  },
  NFT: {
    MAINNET: '0x...',
    SEPOLIA: '0x...',
  },
  HOOK: {
    MAINNET: '0x...',
    SEPOLIA: '0x...',
  },
};

/**
 * @title Chain Configuration
 */
export const CHAINS = {
  ETHEREUM: 1,
  SEPOLIA: 11155111,
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
