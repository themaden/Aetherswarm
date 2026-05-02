import { ethers } from 'ethers';
import { aiLoopService } from './aiLoop';

// Minimal ABI for the AetherSwarmVault to listen to the Deposited event
const vaultAbi = [
  "event Deposited(address indexed user, uint256 amount)"
];

class Web3ListenerService {
  private provider: ethers.JsonRpcProvider | null = null;
  private vaultContract: ethers.Contract | null = null;

  public initialize() {
    const rpcUrl = process.env.BACKEND_SEPOLIA_RPC_URL;
    const vaultAddress = process.env.VAULT_ADDRESS;

    if (!rpcUrl || !vaultAddress) {
      console.warn("Web3Listener: RPC URL or Vault Address is missing in .env. Event listening is disabled.");
      return;
    }

    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.vaultContract = new ethers.Contract(vaultAddress, vaultAbi, this.provider);

      console.log(`Web3Listener: Connected to Sepolia RPC. Listening to Vault at ${vaultAddress}...`);

      this.vaultContract.on("Deposited", (user: string, amount: bigint, event: any) => {
        console.log(`Web3Listener: Caught Deposited event from ${user}`);
        // Convert wei to ETH
        const amountInEth = ethers.formatEther(amount);
        
        // Trigger the AI Loop
        aiLoopService.triggerAiCycle(amountInEth, user);
      });

    } catch (error) {
      console.error("Web3Listener: Failed to initialize", error);
    }
  }
  
  public async getVaultBalance(): Promise<string> {
    if (!this.provider || !process.env.VAULT_ADDRESS) return "0.0000";
    try {
      const balance = await this.provider.getBalance(process.env.VAULT_ADDRESS);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Web3Listener: Failed to get balance", error);
      return "0.0000";
    }
  }
}

export const web3ListenerService = new Web3ListenerService();
