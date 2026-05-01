import { Request, Response, NextFunction } from 'express';

/**
 * x402 Autonomous Payment Simulation Middleware
 * Implements the "Payment Required" flow for AI agents.
 */
export const x402Middleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if it's a data-heavy AI request
  if (req.path.startsWith('/api/ai/data')) {
    const paymentHeader = req.headers['x-payment-auth'];

    if (!paymentHeader) {
      console.log(' [x402] Request received: No payment found. Returning 402...');
      return res.status(402).json({
        error: 'Payment Required',
        amount: '0.001 USDC',
        recipient: '0x8888...8888',
        method: 'EIP-3009 (transferWithAuthorization)'
      });
    }

    console.log(` [x402] Payment Verified: ${paymentHeader.toString().substring(0, 15)}...`);
  }
  next();
};
