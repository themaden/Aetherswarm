import "dotenv/config";
import { aiLoopService } from "./services/aiLoop";
import { web3ListenerService } from "./services/web3Listener";
import { AxlNode } from "./swarm/axl-node";

const express = require("express");

import { x402Middleware } from "./middleware/x402";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());

// --- Global CORS Configuration ---
app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(x402Middleware);

// Initialize real libp2p node
const p2pNode = new AxlNode();

// --- Simulated Protected AI Data Feed (x402) ---
app.get("/api/ai/data/sentiment", (_req: any, res: any) => {
  res.json({
    source: "GlobalSentimentNode",
    sentiment: 0.78,
    timestamp: Date.now()
  });
});

app.get("/", (_req: any, res: any) => {
  res.json({ 
    message: "AetherSwarm AI Oracle API is online", 
    version: "1.0.0",
    status: "Secure (TEE Encrypted)"
  });
});



app.get("/api/health", (_req: any, res: any) => {
  res.json({ ok: true, service: "aetherswarm-api", timestamp: Date.now() });
});

app.get("/api/logs", (_req: any, res: any) => {
  res.json({ logs: aiLoopService.getLogs() });
});

app.get("/api/agents", (_req: any, res: any) => {
  // Combine local node with dynamically discovered peers
  const localAgent = {
      id: p2pNode.getLibp2pId(),
      name: "Local Swarm Node",
      role: "Execution Router",
      status: p2pNode.status,
      location: "Local TEE"
  };

  const discoveredPeers = p2pNode.getConnectedPeers().map((peer, i) => ({
      id: peer.id,
      name: `Node ${peer.id.substring(peer.id.length - 4)}`,
      role: ["Market Analyzer", "Sentiment Engine", "Volatility Oracle", "MEV Defender"][i % 4],
      status: "Active",
      location: "P2P Mesh"
  }));

  res.json({ agents: [localAgent, ...discoveredPeers] });
});

app.get("/api/agents/:id", (req: any, res: any) => {
  res.status(404).json({ error: "Detailed agent view requires higher authorization level." });
});

app.get("/api/portfolio", (_req: any, res: any) => {
  res.json({
    totalValue: 1250000,
    dayChange: 4.2,
    allocation: {
      ETH: 0.35,
      USDC: 0.45,
      DAI: 0.15,
      Other: 0.05,
    },
  });
});

app.get("/api/portfolio/holdings", (_req: any, res: any) => {
  res.json({
    holdings: [
      { symbol: "ETH", value: 437500, allocation: 0.35 },
      { symbol: "USDC", value: 562500, allocation: 0.45 },
      { symbol: "DAI", value: 187500, allocation: 0.15 },
      { symbol: "Other", value: 62500, allocation: 0.05 },
    ],
  });
});

app.get("/api/portfolio/performance", (_req: any, res: any) => {
  res.json({
    apy: 14.2,
    monthlyChange: 12.5,
    riskScore: "Low",
  });
});

app.get("/api/transactions", (_req: any, res: any) => {
  res.json({ transactions: aiLoopService.getTransactions() });
});

app.get("/api/execution/hooks", (_req: any, res: any) => {
  res.json({ hook: aiLoopService.getHookData() });
});

app.post("/api/vault/deposits", (req: any, res: any) => {
  const { token, amount, account } = req.body || {};

  if (!token || !amount || !account) {
    res.status(400).json({ error: "token, amount and account are required" });
    return;
  }

  res.status(202).json({
    status: "queued",
    token,
    amount,
    account,
    message: "Deposit accepted by mock API. Contract integration is the next step.",
  });
});

app.post("/api/vault/withdraw", (req: any, res: any) => {
  const { token, amount, account } = req.body || {};

  if (!token || !amount || !account) {
    res.status(400).json({ error: "token, amount and account are required" });
    return;
  }

  res.status(202).json({
    status: "queued",
    token,
    amount,
    account,
    message: "Withdraw accepted by mock API. Contract integration is the next step.",
  });
});

app.get("/api/tee/attestation", (_req: any, res: any) => {
  res.json({
    isValid: true,
    provider: "Intel SGX",
    enclave: "0G Labs",
    timestamp: Date.now(),
  });
});

app.post("/api/test/trigger-loop", (req: any, res: any) => {
  aiLoopService.triggerAiCycle("0.1", "0xYourWalletAddress123");
  res.json({ success: true, message: "AI cycle triggered manually." });
});

app.use((req: any, res: any) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// Initialize Blockchain Listener
web3ListenerService.initialize();

const server = app.listen(port, async () => {
  console.log(`\n [GHOST_SWARM] Agent Node API Online: http://localhost:${port}`);
  
  // Start real P2P mesh connection
  await p2pNode.start();
});

server.on("error", (error: Error) => {
  console.error("AetherSwarm API failed to start:", error);
  process.exitCode = 1;
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
