
/**
 * @dev Minimal ABI for ERC20 Token (e.g., Mock USDC)
 * Used to check balances and approve the Vault to spend user's tokens.
 */
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function mint(address to, uint256 amount) external" // Only for our mock token
];

/**
 * @dev Minimal ABI for the AetherSwarmVault smart contract
 * Used to trigger the deposit function.
 */
export const VAULT_ABI = [
  "function deposit(address token, uint256 amount) external"
];

// Placeholder addresses for testnet (We will replace these when we deploy)
export const CONTRACT_ADDRESSES = {
  VAULT: "0x1234567890123456789012345678901234567890", // Replace later
  MOCK_USDC: "0x0987654321098765432109876543210987654321" // Replace later
};