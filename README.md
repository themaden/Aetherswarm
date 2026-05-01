<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-half.svg" width="100" alt="AetherSwarm Logo">
  <h1>AetherSwarm Architecture 🦾</h1>
  <p><strong>Decentralized Autonomous Black-Box Hedge Fund & Ghost Swarm Architecture</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue?style=flat-square&logo=solidity)](https://soliditylang.org/)
  [![0G Labs](https://img.shields.io/badge/0G_Labs-deAIOS-black?style=flat-square)](https://0g.ai/)
  [![Gensyn](https://img.shields.io/badge/Gensyn-AXL-purple?style=flat-square)](https://gensyn.ai/)
</div>

<br/>

## 📝 Technical Abstract

AetherSwarm is a radical decentralized finance (DeFi) architecture that merges **Hardware-Locked Trading Logic** with a **Distributed Agent Mesh**. By utilizing 0G Labs' "Sealed Inference" and Uniswap v4's "Hooks", AetherSwarm creates a sovereign digital entity where the trading strategy is invisible to node operators and execution is autonomously managed on-chain.

---

## 🛠 Protocol Integration Matrix

The following table breaks down the core components integrated into the AetherSwarm stack and their functional roles:

| Component | Integration Layer | Functional Role |
| :--- | :--- | :--- |
| **0G deAIOS** | Compute (TEE) | **Sealed Inference:** Hardware-based isolation (Intel TDX) for proprietary strategy execution. |
| **0G Storage** | Persistence | **Decentralized Memory:** Storing model checkpoints and agent state proofs with high throughput (2 GB/s). |
| **Gensyn AXL** | Networking (P2P) | **Ghost Swarm:** Peer-to-peer agent discovery and encrypted communication via Yggdrasil/TLS. |
| **Uniswap v4** | Execution | **SwarmHook:** Dynamic fee adjustments to mitigate LVR (Loss-Versus-Rebalancing) in real-time. |
| **ERC-7857** | Ownership | **Intelligent NFT (iNFT):** Encapsulated agent ownership with re-encryption keys for metadata security. |
| **DeepSeek AI** | Intelligence | **Neural Engine:** High-performance LLM for real-time market sentiment and volatility analysis. |

---

## 🕸 System Architecture (Ghost Swarm)

```mermaid
flowchart TD
    User((User/Investor)) -- "Deposit ETH" --> Vault[AetherSwarm Vault]
    Vault -- "Trigger Event" --> Listener[Web3 Listener]
    Listener -- "Notify" --> Swarm[Ghost Swarm Enclave]
    
    subgraph "0G Labs & TEE Environment"
    Swarm -- "Fetch Context" --> DeepSeek[DeepSeek LLM Engine]
    DeepSeek -- "Generate Decision" --> Decision[Signed Trade Signal]
    Decision -- "Anchor Proof" --> OGStorage[0G Storage]
    end
    
    Decision -- "Update Fee" --> Hook[Uniswap v4 Hook]
    Hook -- "Protect Pool" --> LP[Liquidity Provider]
```

---

## ⛓ Deployed Contracts (Sepolia Testnet)

The following smart contracts have been deployed to the Sepolia test network for the live presentation:

| Contract | Function | Address |
| :--- | :--- | :--- |
| **AetherSwarmVault** | Asset management & strategy execution | `0xf5d5e9a76075216088e6f082dffed23bb02e6852` |
| **AetherSwarmiNFT** | Agent ownership & Intelligent NFT standard | `0x2761dfbde1559f21cd3401ff128bd46976112ae9` |
| **SwarmHook (Mock)** | Uniswap v4 dynamic fee controller | `0x83A648eF0b1d0A8c2C402D15Aa0Fd62eDE2D0D83` |

---

## 🦾 Key Innovation: Sealed Inference

Unlike traditional centralized AI where model weights are exposed, AetherSwarm utilizes a **Zero-Trust model**:

1. **Input:** Market data is ingested into the TEE via encrypted streams.
2. **Execution:** The AI model (DeepSeek) runs in an isolated hardware enclave.
3. **Output:** A cryptographic proof of the decision is generated, preventing anyone (including node operators) from seeing the raw strategy logic.
4. **Verification:** RA (Remote Attestation) reports verify that the code running in the enclave is exactly what was audited.

---

## 🚀 Presentation Mode: Quick Start

To demonstrate the "Intelligence Loop" during the presentation:

1. **Start the API:** `cd backend && npm run start`
2. **Start the UI:** `cd frontend && npm run dev`
3. **Trigger AI Cycle:** 
   ```bash
   curl -X POST http://localhost:3001/api/test/trigger-loop
   ```
   *This command will manually trigger the DeepSeek AI engine to analyze a mock deposit and broadcast the decision to the live terminal.*

---

## 📜 License
This project is licensed under the MIT License.

<div align="center">
  <sub>Built for the future of Autonomous Finance. 🦾✨</sub>
</div>
