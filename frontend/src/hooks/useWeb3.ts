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
      alert("MetaMask is not installed! Please install it to use AetherSwarm.");
      return;
    }
    
    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Wallet disconnect function
  const disconnectWallet = () => {
    setAccount(null);
    console.log("Wallet disconnected");
  };

  // Uzun adresi kısaltmak için (Örn: 0x1234...abcd)
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return { account, connectWallet, disconnectWallet, isConnecting, formatAddress };
}
