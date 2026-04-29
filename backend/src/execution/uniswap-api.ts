// backend/src/execution/uniswap-api.ts
import { AlphaRouter } from '@uniswap/smart-order-router';

export class UniswapAPIService {
    private router: AlphaRouter;

    constructor(provider: any) {
        this.router = new AlphaRouter({ chainId: 11155111, provider });
    }

    // Finds the cheapest way to swap tokens
    async findBestRoute(tokenIn: any, tokenOut: any, amount: any) {
        return await this.router.route(amount, tokenOut, 0); // 0 = Exact Input
    }
}