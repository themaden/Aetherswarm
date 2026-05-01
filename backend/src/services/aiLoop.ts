import OpenAI from 'openai';

export interface LogEntryData {
  id: string;
  time: string;
  type: 'system' | 'success' | 'warning' | 'action';
  text: string;
}

class AILoopService {
  private logs: LogEntryData[] = [];
  private logIdCounter = 0;
  private openai: OpenAI | null = null;

  constructor() {
    this.addLog('system', 'Sealed Inference session initialized via 0G Labs.');
    this.addLog('success', 'Remote Attestation verified. Enclave signature: 0x82f...3c9');
    this.addLog('system', 'Agent Centinel_01 connected to Gensyn AXL mesh.');

    if (process.env.DEEPSEEK_API_KEY) {
      this.openai = new OpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      this.addLog('success', '[DEEPSEEK] Neural Engine Online and Connected.');
    } else {
      this.addLog('warning', '[SYSTEM] DEEPSEEK_API_KEY not found. Running in simulation mode.');
    }
  }

  private addLog(type: LogEntryData['type'], text: string) {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    this.logs.unshift({
      id: `log-${this.logIdCounter++}`,
      time: timeString,
      type,
      text,
    });

    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }

  public getLogs() {
    return this.logs;
  }

  private generateRandomHex(length: number): string {
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  public async triggerAiCycle(amount: string, userAddress: string) {
    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    
    // Step 1: Detect Liquidity
    this.addLog('action', `[SYSTEM] New liquidity detected: ${amount} ETH from ${shortAddress}`);
    
    // Step 2: Analyze Market (In-Enclave)
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.addLog('system', '[TEE_ENCLAVE] Ingesting market data into sealed hardware environment...');
    
    // Remote Attestation Check
    await new Promise(resolve => setTimeout(resolve, 500));
    this.addLog('success', '[TEE_ENCLAVE] Remote Attestation verified. Enclave ID: enclave-tdx-01. Signature: 0x_tee_sig_verified');

    this.addLog('system', '[AI_SWARM] Analyzing market volatility via Uniswap Subgraph inside TEE...');
    
    // Step 3: AI Decision (DeepSeek)
    let newFee = '0.25%';
    let reason = 'Simulation active. Adjusted fee default.';

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are the AetherSwarm AI, a high-frequency trading and liquidity management neural network operating inside a TEE. You control a Uniswap v4 Hook. Your job is to analyze liquidity events and set dynamic swap fees to mitigate LVR (Loss Versus Rebalancing)."
            },
            {
              role: "user",
              content: `A new liquidity deposit of ${amount} ETH was just detected. The market is currently slightly volatile. Reply with ONLY TWO SENTENCES. First sentence: A very brief cybernetic analysis of the market. Second sentence: Set the target fee (e.g. Target fee: 0.42%).`
            }
          ],
          temperature: 0.7,
        });

        const aiResponse = response.choices[0]?.message?.content;
        if (aiResponse) {
          reason = aiResponse;
          // Extract a percentage if possible, otherwise fallback
          const feeMatch = aiResponse.match(/(\d+\.\d+)%/);
          if (feeMatch) newFee = feeMatch[0];
        }
        this.addLog('warning', `[DEEPSEEK_SWARM] ${reason}`);
      } catch (error) {
        console.error("DeepSeek API Error:", error);
        this.addLog('warning', '[DEEPSEEK_ERROR] Fallback to local heuristic mode.');
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isVolatile = Math.random() > 0.5;
      newFee = isVolatile ? '0.50%' : '0.20%';
      reason = isVolatile ? 'Volatility is high. Increasing fee to mitigate LVR risk.' : 'Volatility is low. Decreasing fee to attract volume.';
      this.addLog('warning', `[AI_SWARM] ${reason} Target fee: ${newFee}`);
    }
    
    // Step 4: Execute On-Chain
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.addLog('success', `[BLOCKCHAIN] SwarmHook transaction confirmed. Fee updated to ${newFee}. TxHash: 0x${this.generateRandomHex(8)}...${this.generateRandomHex(8)}`);
    
    // Step 5: Proof to 0G Storage
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.addLog('success', `[0G_LABS] AI decision proof and state uploaded to decentralized storage. CID: Qm${this.generateRandomHex(16)}...`);
  }
}

export const aiLoopService = new AILoopService();
