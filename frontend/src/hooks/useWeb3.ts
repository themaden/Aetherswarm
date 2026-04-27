"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // When the page loads, check whether the wallet has already been connected
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(web3Provider);

      // Refresh state when the account changes
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else setAccount(null);
      });
    }
  }, []);

  // Wallet connection function
  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask is not installed! Please install it to use AetherSwarm.");
      return;
    }
    
    try {
      setIsConnecting(true);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Uzun adresi kısaltmak için (Örn: 0x1234...abcd)
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return { account, connectWallet, isConnecting, formatAddress };
}