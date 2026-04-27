import {ethers} from "ethers";

/**
 * @class X402Middleware
 * @description Implements the Coinbase x402 protocol for autonomous agents-to-agent payments.
 */

export class X402PaymentHandler {
     
     private wallet: ethers.Wallet;

     constructor(privateKey: string, provider: ethers.JsonRpcProvider) {
          this.wallet = new ethers.Wallet(privateKey, provider);
     }

     /**
     * @dev Intercepts HTTP 402 "Payment Required" and signs a transaction.
     * Uses EIP-3009 (transferWithAuthorization) for gasless-like payments.
     */

     async handlePaymentRequired(errorResponse: any): Promise<string> {
        const { amount, recipient, nonce } = errorResponse.data;
        
        console.log(`[x402] Payment Required: ${amount} USDC to ${recipient}`);

        // Sign the payment authorization
        const signature = await this.wallet.signMessage(
            ethers.solidityPacked(
                ["address", "address", "uint256", "uint256"],
                [this.wallet.address, recipient, amount, nonce]
            )
        );

        console.log("[x402] Payment signed and sent via X-PAYMENT header.");
        return signature;
    }
}