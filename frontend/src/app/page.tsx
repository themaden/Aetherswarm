"use client";

import React, { type ReactNode, useMemo } from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Terminal as TerminalIcon, ChevronRight, Wallet, Globe, Lock, TrendingUp, ArrowUpRight } from 'lucide-react';
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

  // Auto-scroll terminal to bottom
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
    setTimeout(() => setTriggerLoading(false), 2000);
  };

  const formattedTVL = useMemo(() => {
    if (!mounted || !vaultBalance) return "0.0000 ETH";
    const val = parseFloat(formatEther(vaultBalance.value));
    return `${val.toFixed(4)} ETH`;
  }, [vaultBalance, mounted]);

  const formattedUserBalance = useMemo(() => {
    if (!mounted || !userBalance) return "—";
    const val = parseFloat(formatEther(userBalance.value));
    return `${val.toFixed(4)} ETH`;
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

      {/* WRONG NETWORK */}
      {isWrongNetwork && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <p className="text-sm text-amber-200/80 font-medium">⚠️ Yanlış ağ! <span className="font-bold text-white">Sepolia Testnet</span> ağına geçin.</p>
          <button onClick={() => switchChain({ chainId: sepolia.id })} className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95">Ağı Değiştir</button>
        </div>
      )}

      {/* HEADER + STATUS */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">AetherSwarm <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Dashboard</span></h1>
              <p className="text-slate-600 text-[11px] font-medium">Merkeziyetsiz Otonom Hedge Fund • Sepolia Testnet</p>
            </div>
          </div>
        </div>

        {/* Live Connection Status */}
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`}></div>
            <span className={isConnected ? 'text-emerald-400' : 'text-slate-600'}>{isConnected ? shortAddress : 'Cüzdan Bağlı Değil'}</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]' : 'bg-red-400'}`}></div>
            <span className={backendStatus === 'connected' ? 'text-blue-400' : 'text-red-400'}>Backend {backendStatus === 'connected' ? 'Online' : 'Offline'}</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <span className="text-slate-600">{chainId === sepolia.id ? '🟢 Sepolia' : `⚠️ Chain #${chainId}`}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={handleTrigger}
          disabled={triggerLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-blue-400/20 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60"
        >
          <Activity size={14} className={triggerLoading ? 'animate-spin' : 'animate-pulse'} />
          {triggerLoading ? 'Çalışıyor...' : 'AI Döngüsünü Başlat'}
        </button>
        <button onClick={handleMintAgent} disabled={isMintPending || isMintConfirming || !accountAddress || isWrongNetwork} className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-5 py-3 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 active:scale-95">
          <Cpu size={14} className={isMintPending || isMintConfirming ? 'animate-pulse text-yellow-400' : 'text-emerald-400'} /> Ajan Oluştur (iNFT)
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Vault TVL" value={formattedTVL} icon={<Lock size={16} />} iconColor="text-blue-400" glowFrom="from-blue-500/5" />
        <StatCard title="Bakiyeniz" value={formattedUserBalance} icon={<Wallet size={16} />} iconColor="text-emerald-400" glowFrom="from-emerald-500/5" />
        <StatCard title="Dinamik Fee" value={hookData ? hookData.dynamicFee : '—'} icon={<TrendingUp size={16} />} iconColor="text-yellow-400" glowFrom="from-yellow-500/5" />
        <StatCard title="iNFT Ajanlar" value={formattedAgents} icon={<Cpu size={16} />} iconColor="text-purple-400" glowFrom="from-purple-500/5" />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AI TERMINAL */}
        <div className="lg:col-span-8">
          <section className="bg-[#0a0a12] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-red-500/80 rounded-full hover:bg-red-400 transition-colors"></div>
                <div className="w-3 h-3 bg-yellow-500/80 rounded-full hover:bg-yellow-400 transition-colors"></div>
                <div className="w-3 h-3 bg-green-500/80 rounded-full hover:bg-green-400 transition-colors"></div>
                <span className="ml-3 text-[10px] text-slate-500 font-mono font-bold">aetherswarm — ai-neural-loop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${backendStatus === 'connected' ? 'text-emerald-500/60' : 'text-red-500/60'}`}>{backendStatus === 'connected' ? 'Live Stream' : 'Disconnected'}</span>
              </div>
            </div>
            {/* Terminal Body */}
            <div className="p-5 space-y-1 h-[360px] overflow-y-auto font-mono text-[11px] custom-scrollbar">
              {logs.length > 0 ? (
                logs.map((log: any) => {
                  const t = log.text;
                  const isDecision = t.includes('AI_DECISION');
                  const isProof = t.includes('PROOF');
                  const isTEE = t.includes('TEE_ENCLAVE') || t.includes('Sealed');
                  const isData = t.includes('DATA') || t.includes('Fetching');
                  const isSystem = t.includes('SYSTEM') || t.includes('WEB3') || t.includes('DEEPSEEK');
                  const isError = t.includes('FAIL') || t.includes('ERROR');

                  let bgClass = '';
                  let textClass = 'text-slate-500';

                  if (isDecision) { bgClass = 'bg-yellow-500/[0.06] border-l-2 border-yellow-500/60 ml-0 pl-3'; textClass = 'text-yellow-300 font-semibold'; }
                  else if (isProof) { bgClass = 'bg-purple-500/[0.06] border-l-2 border-purple-500/60 ml-0 pl-3'; textClass = 'text-purple-300 font-semibold'; }
                  else if (isTEE) { textClass = 'text-cyan-400'; }
                  else if (isData) { textClass = 'text-blue-400/80'; }
                  else if (isSystem) { textClass = 'text-slate-400'; }
                  else if (isError) { textClass = 'text-red-400'; }

                  return (
                    <div key={log.id} className={`py-1.5 px-2 rounded ${bgClass} hover:bg-white/[0.02] transition-colors`}>
                      <span className="text-slate-700 mr-2 select-none">[{log.time}]</span>
                      <span className={textClass}>{t}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-700">
                  <TerminalIcon size={28} strokeWidth={1} />
                  <div className="text-center">
                    <p className="text-xs font-medium mb-1">AI döngüsü bekleniyor</p>
                    <p className="text-[10px] text-slate-800">&quot;AI Döngüsünü Başlat&quot; butonuna basın</p>
                  </div>
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-4 space-y-5">

          {/* DEPOSIT */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={14} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Kasaya ETH Yatır</h2>
            </div>
            <div className="space-y-4">
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.01" className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3.5 px-4 text-lg font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/40 transition-all font-mono" />
              <button onClick={handleDeposit} disabled={isDepositPending || isDepositConfirming || !accountAddress || !depositAmount || isWrongNetwork} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs uppercase tracking-wider disabled:opacity-30 shadow-lg shadow-emerald-500/10">
                {isDepositPending || isDepositConfirming ? 'İşleniyor...' : 'Yatır'} <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* ACTIVE AGENTS */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Aktif Ajan Düğümleri</h4>
            <div className="space-y-2.5">
              {agents.slice(0, 4).map((agent: any) => (
                <div key={agent.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                    <div>
                      <p className="text-[11px] font-bold text-white">{agent.name}</p>
                      <p className="text-[9px] text-slate-600">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-700 font-mono">{agent.location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTRACTS */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Kontrat Adresleri</h4>
            <div className="space-y-2 font-mono text-[9px]">
              <div className="flex items-start gap-2">
                <span className="text-slate-700 shrink-0">Vault:</span>
                <span className="text-blue-400/80 break-all">{CONTRACT_ADDRESSES.VAULT.SEPOLIA}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-700 shrink-0">iNFT:</span>
                <span className="text-emerald-400/80 break-all">{CONTRACT_ADDRESSES.NFT.SEPOLIA}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  glowFrom: string;
}

function StatCard({ title, value, icon, iconColor, glowFrom }: StatCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:border-white/[0.1] hover-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${glowFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`${iconColor} opacity-60`}>{icon}</div>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{title}</span>
        </div>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}
