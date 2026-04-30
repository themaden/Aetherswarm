"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import type { Eip1193Provider } from "ethers";

interface EthereumProvider extends Eip1193Provider {
  on?: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
  removeListener?: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
}

function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { ethereum?: EthereumProvider }).ethereum || null;
}

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When the page loads, check whether the wallet has already been connected
  useEffect(() => {
    const ethereum = getEthereumProvider();

    if (ethereum?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };

      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Wallet connection function
  const connectWallet = async () => {
    // If already connected, disconnect instead
    if (account) {
      disconnectWallet();
      return;
    }

    const ethereum = getEthereumProvider();

    if (!ethereum) {
      const msg = "MetaMask is not installed! Please install it to use AetherSwarm.";
      setError(msg);
      alert(msg);
      return;
    }
    
    try {
      setError(null);
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setError("No accounts found. Please enable accounts in MetaMask.");
      }
    } catch (error: any) {
      let errorMsg = "Failed to connect wallet";
      
      if (error.code === "INVALID_ARGUMENT") {
        errorMsg = "MetaMask is not responding. Please make sure MetaMask is open.";
      } else if (error.code === 4001 || error.message?.includes("rejected")) {
        errorMsg = "Connection rejected. Please approve the connection in MetaMask.";
      } else if (error.message?.includes("Network error")) {
        errorMsg = "Network error. Please check your connection.";
      } else {
        errorMsg = error.message || errorMsg;
      }
      
      setError(errorMsg);
      console.error("Wallet connection failed:", error);
      alert(errorMsg);
    } finally {
      setIsConnecting(false);
    }
  };

  // Wallet disconnect function
  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
    console.log("Wallet disconnected");
  };

  // Uzun adresi kısaltmak için (Örn: 0x1234...abcd)
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return { account, connectWallet, disconnectWallet, isConnecting, error, formatAddress };
}
