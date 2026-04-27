/**
 * @class PrivateRPCProvider
 * @description Routes transactions through private endpoints like Alchemy or MEV Blocker.
 */

export class PrivateRPCProvider {
     
     private endpoint: string;

     constructor(apiKey: string) {
         
        this.endpoint = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
     }

     /**
      * @dev Sends a signed transaction directly to a private builder.
      */

     async sendPrivateTransaction(signedRawTx: string) {
        console.log("[Security] Routing transaction through Private RPC...");
        // This avoids the public mempool where predators wait
        return await fetch(this.endpoint, {
            method: "POST",
            body: JSON.stringify({ method: "eth_sendRawTransaction", params: [signedRawTx] })
        });
    }
}