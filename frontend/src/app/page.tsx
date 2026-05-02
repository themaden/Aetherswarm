"use client";

import React, { type ReactNode, useMemo } from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Terminal as TerminalIcon, ChevronRight, Wallet, Lock, TrendingUp, ArrowUpRight, Globe, Layers, CreditCard, BrainCircuit } from 'lucide-react';
import { useBalance, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import VaultABI from '@/abis/AetherSwarmVault.json';
import iNFTABI from '@/abis/AetherSwarmiNFT.json';
import { sepolia } from 'wagmi/chains';

export default function AetherSwarmDashboard() {
  const { address: accountAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('');
  const [backendStatus, setBackendStatus] = React.useState<'connected' | 'disconnected'>('disconnected');
  const [triggerLoading, setTriggerLoading] = React.useState(false);

  const [hookData, setHookData] = React.useState<any>(null);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [agents, setAgents] = React.useState<any[]>([]);
  const logEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [hookRes, logsRes, agentsRes] = await Promise.all([
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/logs'),
          fetch('http://localhost:3001/api/agents')
        ]);
        const hookInfo = await hookRes.json();
        const logsData = await logsRes.json();
        const agentsData = await agentsRes.json();
        setHookData(hookInfo.hook);
        setLogs(logsData.logs || []);
        setAgents(agentsData.agents || []);
        setBackendStatus('connected');
      } catch (error) {
        console.error("Backend fetch error:", error);
        setBackendStatus('disconnected');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // On-chain data
  const { data: vaultBalance, refetch: refetchVaultBalance } = useBalance({
    address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
    query: { enabled: mounted }
  });

  const { data: userBalance } = useBalance({
    address: accountAddress,
    query: { enabled: mounted && !!accountAddress }
  });

  const { data: agentCount, refetch: refetchAgents } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
    abi: iNFTABI,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    query: { enabled: mounted && !!accountAddress && chainId === sepolia.id }
  });

  const { data: mintHash, writeContract: writeMint, isPending: isMintPending } = useWriteContract();
  const { data: depositHash, writeContract: writeDeposit, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({ hash: mintHash });
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });

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

  const handleTrigger = async () => {
    setTriggerLoading(true);
    try {
      await fetch('http://localhost:3001/api/test/trigger-loop', { method: 'POST' });
    } catch (e) { console.error(e); }
    setTimeout(() => setTriggerLoading(false), 3000);
  };

  const formattedTVL = useMemo(() => {
    if (!mounted || !vaultBalance) return "0.0000";
    return parseFloat(formatEther(vaultBalance.value)).toFixed(4);
  }, [vaultBalance, mounted]);

  const formattedUserBalance = useMemo(() => {
    if (!mounted || !userBalance) return "—";
    return `${parseFloat(formatEther(userBalance.value)).toFixed(4)} ETH`;
  }, [userBalance, mounted]);

  const formattedAgents = useMemo(() => {
    if (!mounted || agentCount === undefined || agentCount === null) return "0";
    return agentCount.toString();
  }, [agentCount, mounted]);

  const shortAddress = accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}` : null;

  if (!mounted) return null;
  const isWrongNetwork = accountAddress && chainId !== sepolia.id;

  return (
    <div className="space-y-6 fade-in-up">

      {/* WRONG NETWORK BANNER */}
      {isWrongNetwork && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-amber-200/80 font-medium">⚠️ Wrong network. Switch to <span className="font-bold text-white">Sepolia Testnet</span></p>
          <button onClick={() => switchChain({ chainId: sepolia.id })} className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95">Switch</button>
        </div>
      )}

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/[0.08] via-transparent to-emerald-600/[0.06] border border-white/[0.06] p-6">
        <div className="absolute top-0 right-0 opacity-[0.03]">
          <BrainCircuit size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">AetherSwarm</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Decentralized Autonomous Black-Box Hedge Fund</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-lg leading-relaxed">AI agents analyze markets via <span className="text-blue-400 font-semibold">DeepSeek</span>, seal decisions in <span className="text-cyan-400 font-semibold">TEE hardware</span>, and execute on-chain via <span className="text-purple-400 font-semibold">Uniswap v4 Hooks</span>.</p>
          </div>

          {/* Live Status Indicators */}
          <div className="flex items-center gap-5 text-[9px] font-bold uppercase tracking-wider shrink-0">
            <StatusPill active={isConnected} label={isConnected ? shortAddress! : 'No Wallet'} />
            <StatusPill active={backendStatus === 'connected'} label={backendStatus === 'connected' ? 'Backend Live' : 'Backend Off'} />
            <StatusPill active={chainId === sepolia.id} label={chainId === sepolia.id ? 'Sepolia' : `Chain ${chainId}`} />
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTrigger}
          disabled={triggerLoading || backendStatus === 'disconnected'}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-blue-400/20 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Activity size={14} className={triggerLoading ? 'animate-spin' : ''} />
          {triggerLoading ? 'Running...' : '▶ Trigger AI Cycle'}
        </button>
        <button onClick={handleMintAgent} disabled={isMintPending || isMintConfirming || !accountAddress || isWrongNetwork} className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-5 py-3 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 active:scale-95">
          <Cpu size={14} className={isMintPending || isMintConfirming ? 'animate-pulse text-yellow-400' : 'text-emerald-400'} /> Mint iNFT Agent
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Vault TVL" value={`${formattedTVL} ETH`} icon={<Lock size={16} />} color="blue" />
        <StatCard title="Your Balance" value={formattedUserBalance} icon={<Wallet size={16} />} color="emerald" />
        <StatCard title="Dynamic Fee" value={hookData ? hookData.dynamicFee : '—'} icon={<TrendingUp size={16} />} color="yellow" />
        <StatCard title="iNFT Agents" value={formattedAgents} icon={<Cpu size={16} />} color="purple" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AI TERMINAL */}
        <div className="lg:col-span-8">
          <section className="bg-[#080810] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500/70 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500/70 rounded-full"></div>
                <span className="ml-3 text-[10px] text-slate-600 font-mono font-bold">aetherswarm ~ neural-intelligence-loop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${backendStatus === 'connected' ? 'text-emerald-600' : 'text-red-600'}`}>{backendStatus === 'connected' ? 'Live' : 'Off'}</span>
              </div>
            </div>
            <div className="p-4 space-y-0.5 h-[340px] overflow-y-auto font-mono text-[11px] custom-scrollbar">
              {logs.length > 0 ? (
                logs.map((log: any) => {
                  const t = log.text;
                  const isDecision = t.includes('AI_DECISION');
                  const isProof = t.includes('PROOF');
                  const isTEE = t.includes('TEE_ENCLAVE') || t.includes('Sealed') || t.includes('Attestation');
                  const isData = t.includes('DATA') || t.includes('Fetching');
                  const isBlockchain = t.includes('BLOCKCHAIN') || t.includes('x402') || t.includes('WEB3');
                  const isStorage = t.includes('0G_STORAGE');
                  const isError = t.includes('FAIL') || t.includes('ERROR');

                  let bg = ''; let text = 'text-slate-600';
                  if (isDecision) { bg = 'bg-yellow-500/[0.06] border-l-2 border-yellow-500/50'; text = 'text-yellow-300 font-semibold'; }
                  else if (isProof) { bg = 'bg-purple-500/[0.06] border-l-2 border-purple-500/50'; text = 'text-purple-300 font-semibold'; }
                  else if (isTEE) { text = 'text-cyan-400'; }
                  else if (isBlockchain) { text = 'text-emerald-400'; }
                  else if (isStorage) { text = 'text-blue-400'; }
                  else if (isData) { text = 'text-blue-400/70'; }
                  else if (isError) { text = 'text-red-400'; }
                  else { text = 'text-slate-500'; }

                  return (
                    <div key={log.id} className={`py-1.5 px-2 rounded ${bg} hover:bg-white/[0.015] transition-colors`}>
                      <span className="text-slate-800 mr-2 select-none">[{log.time}]</span>
                      <span className={text}>{t}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-800">
                  <TerminalIcon size={24} strokeWidth={1} />
                  <p className="text-[10px]">Press &quot;▶ Trigger AI Cycle&quot; to start the intelligence loop</p>
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-4 space-y-4">
          {/* DEPOSIT */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={14} className="text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Deposit to Vault</h2>
            </div>
            <div className="space-y-3">
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.01" className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-lg font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/40 transition-all font-mono" />
              <button onClick={handleDeposit} disabled={isDepositPending || isDepositConfirming || !accountAddress || !depositAmount || isWrongNetwork} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-[10px] uppercase tracking-wider disabled:opacity-30">
                {isDepositPending || isDepositConfirming ? 'Processing...' : 'Deposit ETH'} <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* ARCHITECTURE OVERVIEW — Sunum için kritik */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-3">Protocol Stack</h4>
            <div className="space-y-2">
              <ProtocolRow icon={<ShieldCheck size={12} />} label="TEE / Sealed Inference" value="0G Labs" color="text-cyan-400" />
              <ProtocolRow icon={<Globe size={12} />} label="P2P Swarm Network" value="Gensyn AXL" color="text-blue-400" />
              <ProtocolRow icon={<Layers size={12} />} label="Execution Hook" value="Uniswap v4" color="text-purple-400" />
              <ProtocolRow icon={<CreditCard size={12} />} label="Agent Payments" value="x402 Protocol" color="text-emerald-400" />
              <ProtocolRow icon={<BrainCircuit size={12} />} label="AI Engine" value="DeepSeek" color="text-yellow-400" />
            </div>
          </div>

          {/* ACTIVE AGENTS */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-3">Swarm Agents ({agents.filter(a => a.status === 'Active').length}/{agents.length})</h4>
            <div className="space-y-2">
              {agents.slice(0, 5).map((agent: any) => (
                <div key={agent.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-700'}`}></div>
                    <span className="text-[10px] font-bold text-white">{agent.name}</span>
                  </div>
                  <span className="text-[8px] text-slate-700 font-mono">{agent.location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTRACTS */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">Deployed Contracts (Sepolia)</h4>
            <div className="space-y-1.5 font-mono text-[8px]">
              <div className="flex gap-2"><span className="text-slate-700 shrink-0">Vault</span><span className="text-blue-400/70 break-all">{CONTRACT_ADDRESSES.VAULT.SEPOLIA}</span></div>
              <div className="flex gap-2"><span className="text-slate-700 shrink-0">iNFT</span><span className="text-emerald-400/70 break-all">{CONTRACT_ADDRESSES.NFT.SEPOLIA}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-700'}`}></div>
      <span className={active ? 'text-emerald-400' : 'text-slate-600'}>{label}</span>
    </div>
  );
}

function ProtocolRow({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-2">
        <div className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
      <span className={`text-[10px] font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'blue' | 'emerald' | 'yellow' | 'purple';
}

const colorMap = {
  blue: { icon: 'text-blue-400', glow: 'from-blue-500/5', border: 'hover:border-blue-500/20' },
  emerald: { icon: 'text-emerald-400', glow: 'from-emerald-500/5', border: 'hover:border-emerald-500/20' },
  yellow: { icon: 'text-yellow-400', glow: 'from-yellow-500/5', border: 'hover:border-yellow-500/20' },
  purple: { icon: 'text-purple-400', glow: 'from-purple-500/5', border: 'hover:border-purple-500/20' },
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl group relative overflow-hidden transition-all duration-300 ${c.border} hover-lift`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`${c.icon} opacity-60`}>{icon}</div>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{title}</span>
        </div>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}
