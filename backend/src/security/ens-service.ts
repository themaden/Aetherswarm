import { ethers } from "ethers";

/**
 * @title ENSService
 * @dev Provides naming service for AI Agents using ENS.
 */

export class ENSService {
    private provider: ethers.JsonRpcProvider;

    constructor(rpcUrl: string) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    // Converts 0x123... to "name.eth"
    async getName(address: string): Promise<string | null> {
        return await this.provider.lookupAddress(address);
    }
}