"use client";

import React, { type ReactNode, useMemo } from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { useBalance, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import VaultABI from '@/abis/AetherSwarmVault.json';
import iNFTABI from '@/abis/AetherSwarmiNFT.json';
import { sepolia } from 'wagmi/chains';

export default function AetherSwarmPremium() {
  const { address: accountAddress } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('');
  
  // Backend State
  const [portfolio, setPortfolio] = React.useState<any>(null);
  const [hookData, setHookData] = React.useState<any>(null);
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    
    // Fetch Backend Data
    const fetchData = async () => {
      try {
        const [portfolioRes, hookRes, transRes] = await Promise.all([
          fetch('http://localhost:3001/api/portfolio'),
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/transactions')
        ]);
        
        const portfolioData = await portfolioRes.json();
        const hookInfo = await hookRes.json();
        const transData = await transRes.json();
        
        setPortfolio(portfolioData);
        setHookData(hookInfo.hook);
        setLogs(transData.transactions);
      } catch (error) {
        console.error("Backend fetch error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch Vault TVL
  const { data: vaultBalance, refetch: refetchVaultBalance } = useBalance({
    address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
    query: {
      enabled: mounted,
    }
  });

  // 2. Fetch User's Agent Count
  const { data: agentCount, refetch: refetchAgents } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
    abi: iNFTABI,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    query: {
      enabled: mounted && !!accountAddress && chainId === sepolia.id,
    }
  });

  // 3. Transactions
  const { data: mintHash, writeContract: writeMint, isPending: isMintPending } = useWriteContract();
  const { data: depositHash, writeContract: writeDeposit, isPending: isDepositPending } = useWriteContract();

  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = 
    useWaitForTransactionReceipt({ hash: mintHash });

  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = 
    useWaitForTransactionReceipt({ hash: depositHash });

  // Refetch when transactions are successful
  React.useEffect(() => {
    if (isMintConfirmed) refetchAgents();
    if (isDepositConfirmed) {
      refetchVaultBalance();
      setDepositAmount('');
    }
  }, [isMintConfirmed, isDepositConfirmed, refetchAgents, refetchVaultBalance]);

  const handleMintAgent = () => {
    if (!accountAddress) return;
    writeMint({
      address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
      abi: iNFTABI,
      functionName: 'mintAgent',
      args: [accountAddress, "ipfs://QmDefaultModelCID"],
    });
  };

  const handleDeposit = () => {
    if (!accountAddress || !depositAmount || isNaN(parseFloat(depositAmount))) return;
    writeDeposit({
      address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
      abi: VaultABI,
      functionName: 'depositETH',
      value: parseEther(depositAmount),
    });
  };

  const formattedTVL = useMemo(() => {
    if (!mounted || !vaultBalance) return "0.0000 ETH";
    const val = parseFloat(formatEther(vaultBalance.value));
    return `${isNaN(val) ? '0.0000' : val.toFixed(4)} ${vaultBalance.symbol}`;
  }, [vaultBalance, mounted]);

  const formattedAgents = useMemo(() => {
    if (!mounted || agentCount === undefined || agentCount === null) return "0 Nodes";
    return `${agentCount.toString()} Nodes`;
  }, [agentCount, mounted]);

  if (!mounted) return null;

  const isWrongNetwork = accountAddress && chainId !== sepolia.id;

  return (
    <div className="space-y-8">
      
      {/* WRONG NETWORK WARNING */}
      {isWrongNetwork && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
            <p className="text-sm text-amber-200/80 font-medium">
              You are connected to the wrong network. Please switch to <span className="font-bold text-white">Sepolia Testnet</span> to continue.
            </p>
          </div>
          <button 
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95"
          >
            Switch to Sepolia
          </button>
        </div>
      )}
      
      {/* PAGE HEADER */}
      <div className="fade-in-up flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            Command Center
          </h1>
          <p className="text-slate-500 text-sm">Real-time overview of AetherSwarm protocol operations.</p>
        </div>
        
        {/* MINT BUTTON */}
        <button 
          onClick={handleMintAgent}
          disabled={isMintPending || isMintConfirming || !accountAddress || isWrongNetwork}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-5 py-2.5 text-xs font-bold text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Zap size={14} className={isMintPending || isMintConfirming ? 'animate-pulse text-yellow-400' : 'text-blue-400'} />
          {isMintPending || isMintConfirming ? 'Initializing Neural Link...' : 'Deploy New Agent'}
        </button>
      </div>

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-in-up fade-in-up-1">
        <StatCard 
          title="Vault TVL" 
          value={formattedTVL} 
          change={isDepositConfirmed ? "Updated" : "+0.0%"} 
          icon={<Activity size={20} />}
          iconColor="text-blue-400"
          glowColor="from-blue-500/10"
        />
        <StatCard 
          title="My Agents" 
          value={formattedAgents} 
          change={isMintConfirmed ? "Updated" : "Live"} 
          icon={<Cpu size={20} />}
          iconColor="text-emerald-400"
          glowColor="from-emerald-500/10"
        />
        <StatCard 
          title="Security Level" 
          value={portfolio ? `${portfolio.apy}% APY` : "TEE-Verified"} 
          change={portfolio ? "Lvl 4" : "Lvl 4"} 
          icon={<ShieldCheck size={20} />}
          iconColor="text-purple-400"
          glowColor="from-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TERMINAL & MONITOR */}
        <div className="lg:col-span-8 space-y-6 fade-in-up fade-in-up-2">
          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
            {/* Subtle scan line effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" style={{ animation: 'scan-line 3s linear infinite' }}></div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2.5 font-bold text-white text-sm">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/10">
                  <TerminalIcon size={14} className="text-blue-400" />
                </div>
                Live Intelligence Feed
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">Terminal</span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 border border-red-500/30"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 border border-yellow-500/30"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 border border-green-500/30"></span>
                </div>
              </div>
            </div>
            <div className="space-y-3 h-64 overflow-y-auto font-mono text-sm custom-scrollbar bg-black/30 rounded-xl p-4 border border-white/[0.04]">
              {logs.length > 0 ? (
                logs.map((log: any, idx: number) => (
                  <LogEntry 
                    key={log.id} 
                    time={`${14 + idx}:02:15`} 
                    type={log.status === 'Confirmed' ? 'success' : 'system'} 
                    text={`Swarm Execution: Swap ${log.amount} on ${log.pair} | Fee: ${log.fee}`} 
                  />
                ))
              ) : (
                <>
                  <LogEntry time="14:02:01" type="system" text="Sealed Inference session initialized via 0G Labs." />
                  <LogEntry time="14:02:15" type="success" text="Remote Attestation verified. Enclave signature: 0x82f...3c9" />
                  <LogEntry time="14:02:44" type="system" text="Agent Centinel_01 connected to Gensyn AXL mesh." />
                </>
              )}
            </div>
          </section>

          {/* AGENT FLEET DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AgentCard name="Centinel_01" role="Analysis" status="Active" uptime="99.7%" />
            <AgentCard name="Executor_Alpha" role="Execution" status="Active" uptime="98.2%" />
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div className="lg:col-span-4 space-y-6 fade-in-up fade-in-up-3">
          <div className="bg-gradient-to-br from-blue-600/[0.12] via-blue-500/[0.06] to-emerald-500/[0.08] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-xl relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
              <Zap size={120} />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500/20 via-emerald-500/10 to-transparent"></div>
            
            <h2 className="text-xl font-extrabold text-white mb-1.5 relative z-10">Supply Assets</h2>
            <p className="text-slate-500 text-xs mb-7 relative z-10 leading-relaxed">Contribute to the swarm intelligence pool and earn yield.</p>
            
            <div className="space-y-5 relative z-10">
              <div>
                <div className="flex justify-between text-[10px] mb-2.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Amount in ETH</span>
                  <span className="text-blue-400 font-bold cursor-pointer hover:text-blue-300 transition-colors">MAX</span>
                </div>
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-4 px-5 text-xl font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300" 
                />
              </div>

              {/* Quick amount buttons */}
              <div className="flex gap-2">
                {['0.01', '0.05', '0.1', '0.5'].map((amt) => (
                  <button 
                    key={amt} 
                    onClick={() => setDepositAmount(amt)}
                    className="flex-1 text-[10px] font-bold text-slate-500 bg-white/[0.03] border border-white/[0.06] py-2 rounded-lg hover:bg-white/[0.06] hover:text-white hover:border-white/[0.12] transition-all duration-200"
                  >
                    {amt} ETH
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleDeposit}
                disabled={isDepositPending || isDepositConfirming || !accountAddress || !depositAmount || isWrongNetwork}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] group/btn relative overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  {isDepositPending || isDepositConfirming ? 'Processing Deposit...' : 'Authorize Deposit'}
                </span>
                <ChevronRight size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* QUICK STATS MINI CARD */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">Pool Metrics</h4>
            <div className="space-y-3">
              <MiniStat label="Current APY" value="14.2%" color="text-emerald-400" />
              <MiniStat label="Pool Utilization" value="73%" color="text-blue-400" />
              <MiniStat label="Risk Score" value="Low" color="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  iconColor: string;
  glowColor: string;
}

function StatCard({ title, value, change, icon, iconColor, glowColor }: StatCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden hover-lift">
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-300 ${iconColor}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
          change.includes('+') 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
        }`}>
          {change}
        </span>
      </div>
      <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 relative z-10">{title}</h4>
      <p className="text-2xl font-extrabold text-white relative z-10">{value}</p>
    </div>
  );
}

type LogEntryType = 'system' | 'success' | 'warning' | 'action';

interface LogEntryProps {
  time: string;
  type: LogEntryType;
  text: string;
}

function LogEntry({ time, type, text }: LogEntryProps) {
  const colors: Record<LogEntryType, string> = {
    system: "text-slate-500",
    success: "text-emerald-400",
    warning: "text-amber-400",
    action: "text-blue-400"
  };
  const dotColors: Record<LogEntryType, string> = {
    system: "bg-slate-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    action: "bg-blue-500"
  };
  return (
    <div className="flex gap-3 items-start leading-relaxed hover:bg-white/[0.02] px-2 py-1.5 rounded-lg transition-colors duration-150">
      <span className="text-[10px] text-slate-700 font-semibold mt-0.5 shrink-0 font-mono">[{time}]</span>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColors[type] || 'bg-slate-600'}`}></div>
      <span className={`text-xs ${colors[type] || 'text-slate-300'} leading-relaxed`}>{text}</span>
    </div>
  );
}

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  uptime?: string;
}

function AgentCard({ name, role, status, uptime }: AgentCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex items-center justify-between group hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 hover-lift">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/[0.08] rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
          <Cpu size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">{role}</p>
            {uptime && <p className="text-[10px] text-emerald-500/60 font-mono">↑{uptime}</p>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.6)]"></div>
        <span className="text-[10px] font-bold text-emerald-400">{status}</span>
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string;
  color: string;
}

function MiniStat({ label, value, color }: MiniStatProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className={`text-[13px] font-bold ${color}`}>{value}</span>
    </div>
  );
}
