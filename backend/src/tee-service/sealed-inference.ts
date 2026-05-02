import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { Wallet } from "ethers";
import * as crypto from "crypto";

export class SealedInferenceBroker {
    private broker: any;
    private brokerInitialized: boolean = false;
    private initError: string | null = null;

    constructor(rpcUrl?: string, key?: string) {
        if (rpcUrl && key) {
            this.initializeBroker(rpcUrl, key).catch(err => {
                this.initError = err.message;
                console.warn("[TEE] 0G Broker init failed, falling back to local TDX simulation:", err.message);
            });
        } else {
            console.warn("[TEE] Missing 0G credentials, defaulting to highly realistic TDX simulation.");
            this.initError = "Missing credentials";
        }
    }

    private async initializeBroker(rpcUrl: string, key: string) {
        try {
            const signer = new Wallet(key);
            this.broker = await createZGComputeNetworkBroker(signer);
            this.brokerInitialized = true;
            console.log("[TEE] 0G Serving Broker successfully connected.");
        } catch (error: any) {
            throw new Error(`Failed to initialize 0G Broker: ${error.message}`);
        }
    }

    /**
     * Generates a realistic Intel TDX/SGX Quote structure
     * Used as a fallback when 0G network is unavailable
     */
    private generateRealisticTDXQuote(payload: string): any {
        const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
        
        // MRENCLAVE is a 32-byte measurement of the enclave code
        const mrEnclave = crypto.createHash('sha256').update("AetherSwarm-v2.1-Core").digest('hex');
        // MRSIGNER is a 32-byte hash of the public key of the entity that signed the enclave
        const mrSigner = crypto.createHash('sha256').update("0GLabs-Root-CA").digest('hex');
        
        return {
            quoteVersion: 4,
            attestationKeyType: "ECDSA-P256",
            teeType: "Intel TDX",
            qeSvn: 2,
            pceSvn: 11,
            reportData: payloadHash, // User data bound to the quote
            mrEnclave: mrEnclave,
            mrSigner: mrSigner,
            isvProdId: 1,
            isvSvn: 1,
            signature: crypto.randomBytes(64).toString('hex'), // Mock signature
            attestationTimestamp: new Date().toISOString()
        };
    }

    async getDecision(data: string, useSimulationFallback: boolean = true) {
        // Attempt to use 0G Broker if available
        if (this.brokerInitialized && this.broker) {
            try {
                console.log("[TEE] Submitting inference request to 0G Network...");
                const response = await this.broker.inference.submitInferenceRequest({
                    model: "aetherswarm-ai",
                    prompt: data,
                    useTee: true 
                });
                return {
                    source: "0G_NETWORK",
                    proof: response,
                    status: "SEALED"
                };
            } catch (err: any) {
                console.warn(`[TEE] 0G Network request failed: ${err.message}. Falling back to simulation if allowed.`);
                if (!useSimulationFallback) throw err;
            }
        }

        // Fallback to high-realism TDX simulation
        console.log("[TEE] Generating Intel TDX Attestation Quote...");
        
        // Simulate enclave execution delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const quote = this.generateRealisticTDXQuote(data);
        
        return {
            source: "TDX_SIMULATION",
            proof: quote,
            status: "ATTESTED",
            _warning: "This is a local simulation. A real deployment requires an SGX/TDX enabled node or active 0G credentials."
        };
    }
}