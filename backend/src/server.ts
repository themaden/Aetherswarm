import "dotenv/config";

const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
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

const agents = [
  { id: "1", name: "Node Alpha", role: "Market Analyzer", status: "Active", location: "US-East" },
  { id: "2", name: "Node Beta", role: "Sentiment Engine", status: "Active", location: "EU-Central" },
  { id: "3", name: "Node Gamma", role: "Execution Router", status: "Idle", location: "AP-South" },
  { id: "4", name: "Hook Sentinel", role: "Uniswap v4 Guardian", status: "Active", location: "On-Chain" },
  { id: "5", name: "0G Broker", role: "Sealed Inference", status: "Active", location: "TEE Enclave" },
];

const transactions = [
  { id: "tx-001", pair: "ETH / USDC", amount: "12.5 ETH", fee: "0.35%", status: "Confirmed" },
  { id: "tx-002", pair: "WBTC / USDC", amount: "0.8 BTC", fee: "0.42%", status: "Confirmed" },
  { id: "tx-003", pair: "USDC / DAI", amount: "50,000 USDC", fee: "0.05%", status: "Pending" },
];

app.get("/api/health", (_req: any, res: any) => {
  res.json({ ok: true, service: "aetherswarm-api", timestamp: Date.now() });
});

app.get("/api/agents", (_req: any, res: any) => {
  res.json({ agents });
});

app.get("/api/agents/:id", (req: any, res: any) => {
  const agent = agents.find((item) => item.id === req.params.id);

  if (!agent) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }

  res.json({ agent });
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
  res.json({ transactions });
});

app.get("/api/execution/hooks", (_req: any, res: any) => {
  res.json({
    hook: {
      name: "SwarmHook",
      status: "Active",
      dynamicFee: "0.42%",
      protectionMode: "LVR",
    },
  });
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

app.use((req: any, res: any) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

const server = app.listen(port, () => {
  console.log(`AetherSwarm API listening on http://localhost:${port}`);
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
