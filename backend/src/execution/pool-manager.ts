import { ethers } from "ethers";

/**
 * @class UniswapPoolManager
 * @description Interfaces with the Uniswap v4 Singleton PoolManager contract.
 */

export class UniswapPoolManager {

     private poolManagerContract: ethers.Contract;
      

    constructor(poolManagerAddress: string, signer: ethers.Signer) {
        // Minimal ABI for the v4 PoolManager swap function
        const abi = [
            "function swap(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) params, bytes hookData) external returns (int256 delta)"
        ];
        this.poolManagerContract = new ethers.Contract(poolManagerAddress, abi, signer);
    }

    /**
     * @dev Executes a swap on a specific Uniswap v4 pool.
     */

async executeSwarmTrade(poolKey: any, amount: bigint, isBuy: boolean): Promise<any> {
        console.log(`[PoolManager] Executing Swarm Trade... Amount: ${ethers.formatEther(amount)}`);

        // Swap parameters for v4
        const params = {
            zeroForOne: isBuy, // true = selling token0 for token1
            amountSpecified: amount,
            sqrtPriceLimitX96: isBuy ? 0n : BigInt("1461446703485210103287273052203988822378723970342") // Max/Min limits
        };

        // Pass an empty string for hookData (our hook will intercept automatically)
        const hookData = "0x";

        try {
            const tx = await this.poolManagerContract.swap(poolKey, params, hookData);
            console.log(`[PoolManager] Transaction sent. Hash: ${tx.hash}`);
            return await tx.wait();
        } catch (error) {
            console.error("[PoolManager] Trade execution failed. LVR protection might have blocked it.");
            throw error;
        }
    }
}  