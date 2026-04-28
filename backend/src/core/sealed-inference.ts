// backend/src/core/sealed-inference.ts
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { Wallet } from "ethers";

export class SealedInferenceBroker {
    private broker: any;

    constructor(rpcUrl: string, key: string) {
        // Initialize broker asynchronously
        this.initializeBroker(rpcUrl, key);
    }

    private async initializeBroker(rpcUrl: string, key: string) {
        // Create a signer from the private key
        const signer = new Wallet(key);
        // Create the ZG Compute Network broker
        this.broker = await createZGComputeNetworkBroker(signer);
    }

    // AI makes a decision inside a secure "Black-Box" (TEE)
    async getDecision(data: string) {
        if (!this.broker) {
            throw new Error("Broker not initialized");
        }
        const response = await this.broker.inference.submitInferenceRequest({
            model: "aetherswarm-ai",
            prompt: data,
            useTee: true 
        });
        return response;
    }
}