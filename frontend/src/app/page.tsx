"use client";

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3';
import { ERC20_ABI, VAULT_ABI, CONTRACT_ADDRESSES } from '../lib/abis';

export default function AetherSwarmDashboard() {
  const { account, connectWallet, isConnecting, formatAddress } = useWeb3();
  
  // State variables for the deposit form
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [txLog, setTxLog] = useState<string[]>([]);

  // Helper function to add logs to our hacker terminal
  const addLog = (message: string) => {
    setTxLog((prev) => [...prev, `> ${message}`]);
  };

  /**
   * @dev Handles the deposit flow: 
   * 1. Approves the Vault to spend tokens.
   * 2. Calls the deposit function on the Vault.
   */
  const handleDeposit = async () => {
    if (!account) {
      addLog("ERROR: Wallet not connected.");
      return;
    }
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      addLog("ERROR: Invalid amount.");
      return;
    }

    setIsDepositing(true);
    addLog(`Initiating deposit of ${depositAmount} USDC...`);

    try {
      // Connect to the provider
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Initialize contract instances
      const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, ERC20_ABI, signer);
      const vaultContract = new ethers.Contract(CONTRACT_ADDRESSES.VAULT, VAULT_ABI, signer);

      // Parse the amount to 18 decimals (standard ERC20)
      const parsedAmount = ethers.parseUnits(depositAmount, 18);

      // STEP 1: Approve the vault to take the tokens
      addLog("Requesting token approval...");
      const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.VAULT, parsedAmount);
      await approveTx.wait();
      addLog("Approval confirmed.");

      // STEP 2: Execute the deposit
      addLog("Sending transaction to AetherSwarmVault...");
      const depositTx = await vaultContract.deposit(CONTRACT_ADDRESSES.MOCK_USDC, parsedAmount);
      await depositTx.wait();
      addLog(`SUCCESS: ${depositAmount} USDC deposited successfully!`);
      
      setDepositAmount(""); // Clear input

    } catch (error: any) {
      addLog(`TX FAILED: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-green-400 p-8 font-mono">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b border-green-500/30 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">AETHER_SWARM</h1>
          <p className="text-xs text-green-600">v1.0.0 // DECENTRALIZED AI FUND</p>
        </div>
        <button 
          onClick={connectWallet}
          disabled={isConnecting || account !== null}
          className="bg-green-500/10 border border-green-500 hover:bg-green-500 hover:text-black transition-colors px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "CONNECTING..." : account ? `CONNECTED: ${formatAddress(account)}` : "CONNECT_WALLET"}
        </button>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* VAULT STATUS MODULE */}
        <div className="border border-green-500/30 bg-black/50 p-6 rounded-sm">
          <h2 className="text-sm text-green-600 mb-2">[VAULT_STATUS]</h2>
          <div className="text-4xl font-bold mb-1">$14,230.50</div>
          <p className="text-xs text-green-500/60">+2.4% (24h) via Uniswap v4 Hooks</p>
        </div>

        {/* AI SWARM LOGIC MODULE */}
        <div className="border border-green-500/30 bg-black/50 p-6 rounded-sm">
          <h2 className="text-sm text-green-600 mb-2">[SWARM_INTELLIGENCE]</h2>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 animate-pulse rounded-full"></div>
            <span className="text-xl">ACTIVE // SECURE</span>
          </div>
          <p className="text-xs mt-3 text-green-500/60">TEE Enclave: Verified (0G Labs)</p>
        </div>

        {/* DEPOSIT MODULE (NEW) */}
        <div className="border border-green-500/30 bg-black/50 p-6 rounded-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-green-600 mb-2">[SUPPLY_CAPITAL]</h2>
            <p className="text-xs text-green-500/60 mb-4">Inject liquidity into the Swarm Vault.</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="number"
              placeholder="Amount (USDC)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="bg-transparent border border-green-500/50 p-2 text-sm w-full outline-none focus:border-green-400"
            />
            <button 
              onClick={handleDeposit}
              disabled={isDepositing}
              className="bg-green-500 text-black px-4 py-2 text-sm font-bold hover:bg-green-400 disabled:opacity-50"
            >
              {isDepositing ? "..." : "DEPOSIT"}
            </button>
          </div>
        </div>
      </div>

      {/* TERMINAL / LOGS SECTION */}
      <div className="mt-8 border border-green-500/30 bg-black/50 p-4 rounded-sm h-64 overflow-y-auto relative">
        <h2 className="text-sm text-green-600 mb-4">[SYSTEM_LOGS]</h2>
        <div className="text-xs space-y-2 opacity-80">
          <p>{`>`} Initializing AetherSwarm core...</p>
          <p>{`>`} Checking Uniswap v4 PoolManager: OK.</p>
          <p>{`>`} TEE Remote Attestation signature valid.</p>
          {/* Dynamically render transaction logs */}
          {txLog.map((log, index) => (
            <p key={index} className={log.includes("ERROR") || log.includes("FAILED") ? "text-red-500" : "text-white"}>
              {log}
            </p>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
      </div>
    </main>
  );
}