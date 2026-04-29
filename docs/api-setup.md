# AetherSwarm API Setup

This project is moving from UI mock data to live data in layers. Use env files for keys and addresses; do not commit real secrets.

## Required first

### Ethereum RPC

Use this for contract reads, event logs, and sending transactions through wallets or backend signers.

- Site: https://www.alchemy.com/
- Docs: https://www.alchemy.com/docs/ethereum
- Create an app for Ethereum Sepolia first, then mainnet later.
- Env:
  - `NEXT_PUBLIC_SEPOLIA_RPC_URL`
  - `NEXT_PUBLIC_MAINNET_RPC_URL`
  - `BACKEND_SEPOLIA_RPC_URL`
  - `BACKEND_MAINNET_RPC_URL`

### WalletConnect / Reown project ID

Use this if the app should support WalletConnect wallets in addition to injected wallets like MetaMask.

- Site: https://dashboard.reown.com/
- Docs: https://docs.reown.com/
- Create a project and restrict allowed origins for production.
- Env:
  - `NEXT_PUBLIC_WC_PROJECT_ID`

### Deployed contract addresses

These are created by our own deploy step, not by a third-party site. After deploying the contracts, copy the addresses into env.

- Local command family: `forge script ...`
- Target first: Sepolia
- Env:
  - `NEXT_PUBLIC_VAULT_ADDRESS`
  - `NEXT_PUBLIC_INFT_ADDRESS`
  - `NEXT_PUBLIC_HOOK_ADDRESS`

## Required for protocol features

### 0G Labs

Use this for decentralized AI storage and sealed inference experiments.

- Site: https://docs.0g.ai/
- Need:
  - 0G Galileo/testnet RPC config
  - 0G storage/indexer endpoints
  - funded testnet wallet for compute/storage actions
- Env:
  - `ZEROG_RPC_URL`
  - `ZEROG_STORAGE_NODE_URL`
  - `ZEROG_INDEXER_URL`
  - `ZEROG_PRIVATE_KEY`

### Uniswap v4

Use this for hook development, PoolManager integration, pool data, and swap/execution history.

- Docs: https://developers.uniswap.org/docs/protocols/v4/overview
- Hooks: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks
- PoolManager: https://developers.uniswap.org/docs/protocols/v4/concepts/poolmanager
- Subgraph queries: https://developers.uniswap.org/docs/ecosystem/subgraphs/concepts/v4/queries
- Env:
  - `UNISWAP_V4_SUBGRAPH_URL`
  - `UNISWAP_POOL_MANAGER_ADDRESS`

## Optional later

### Coinbase x402

Use this only if agents need pay-per-request API access or autonomous HTTP 402 payments.

- Docs: https://docs.cdp.coinbase.com/x402/docs/welcome
- Env:
  - `X402_PRIVATE_KEY`
  - `X402_NETWORK`

### Gensyn AXL

Use this for the agent-to-agent mesh layer. AXL exposes a local API rather than a normal cloud API key flow.

- Docs: https://docs.gensyn.ai/
- AXL intro: https://blog.gensyn.ai/introducing-axl/
- Local default from docs/blog: `http://localhost:9002`
- Env:
  - `AXL_API_URL`

## Suggested order

1. Get Alchemy Sepolia RPC.
2. Get Reown project ID.
3. Deploy Vault, iNFT, and Hook contracts to Sepolia.
4. Put deployed addresses into frontend env.
5. Replace backend mock endpoints with chain reads.
6. Add Uniswap v4 subgraph for pool and swap history.
7. Add 0G and TEE flows after the core wallet/vault path works.

