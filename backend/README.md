# AetherSwarm Backend (Ghost Swarm Node) 🦾

This is the core intelligence and networking layer of AetherSwarm. It handles AI decision-making (Sealed Inference), P2P mesh networking (Ghost Swarm), and on-chain execution.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file based on the environment variables required (DeepSeek API Key, Sepolia Private Key, etc.).

3. **Start the Node:**
   ```bash
   npm run start
   ```

## 🛠 Technical Architecture

- **P2P Mesh (libp2p):** Implements real-time peer discovery using mDNS and secure communications via Noise/Yamux. Each backend instance acts as a unique agent node.
- **Sealed Inference (0G Labs):** Integration with `@0glabs/0g-serving-broker`. Falls back to a highly realistic Intel SGX Attestation generator if hardware is unavailable.
- **AI Loop:** Powered by DeepSeek-V3 for volatility analysis and Uniswap v4 Hook fee adjustment logic.
- **Web3 Listener:** Monitors Sepolia testnet for Vault deposit events to trigger autonomous AI cycles.

## 📡 API Endpoints

- `GET /api/agents`: Returns discovered libp2p peers in the mesh.
- `GET /api/logs`: Returns real-time terminal logs of the AI loop.
- `POST /api/test/trigger-loop`: Manually triggers an autonomous AI cycle for demonstration.
