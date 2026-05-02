"use client";

import React, { type ReactNode, useMemo } from 'react';
import { Activity, ShieldCheck, Cpu, Zap, Terminal as TerminalIcon, ChevronRight, Wallet, Globe, Hash } from 'lucide-react';
import { useBalance, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import VaultABI from '@/abis/AetherSwarmVault.json';
import iNFTABI from '@/abis/AetherSwarmiNFT.json';
import { sepolia } from 'wagmi/chains';

export default function AetherSwarmPremium() {
  const { address: accountAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('');
  const [backendStatus, setBackendStatus] = React.useState<'connected' | 'disconnected'>('disconnected');

  const [hookData, setHookData] = React.useState<any>(null);
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [hookRes, logsRes] = await Promise.all([
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/logs')
        ]);
        const hookInfo = await hookRes.json();
        const logsData = await logsRes.json();
        setHookData(hookInfo.hook);
        setLogs(logsData.logs || []);
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

  const shortAddress = accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}` : '—';

  if (!mounted) return null;
  const isWrongNetwork = accountAddress && chainId !== sepolia.id;

  return (
    <div className="space-y-6">

      {/* WRONG NETWORK */}
      {isWrongNetwork && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-amber-200/80 font-medium">Yanlış ağ! <span className="font-bold text-white">Sepolia Testnet</span> ağına geçin.</p>
          <button onClick={() => switchChain({ chainId: sepolia.id })} className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg">Ağı Değiştir</button>
        </div>
      )}

      {/* USER STATUS BAR - Her şey açık ve net */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatusItem icon={<Wallet size={14} />} label="Cüzdan" value={isConnected ? shortAddress : 'Bağlı Değil'} color={isConnected ? 'text-emerald-400' : 'text-red-400'} />
          <StatusItem icon={<Globe size={14} />} label="Ağ" value={chainId === sepolia.id ? 'Sepolia' : `Chain #${chainId}`} color={chainId === sepolia.id ? 'text-emerald-400' : 'text-amber-400'} />
          <StatusItem icon={<Activity size={14} />} label="Bakiye" value={formattedUserBalance} color="text-blue-400" />
          <StatusItem icon={<Cpu size={14} />} label="Backend" value={backendStatus === 'connected' ? 'Bağlı' : 'Bağlantı Yok'} color={backendStatus === 'connected' ? 'text-emerald-400' : 'text-red-400'} />
          <StatusItem icon={<ShieldCheck size={14} />} label="Ajan Sayısı" value={formattedAgents} color="text-purple-400" />
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">AetherSwarm <span className="text-blue-500">Dashboard</span></h1>
          <p className="text-slate-500 text-sm">Tüm veriler blockchain ve backend&apos;den canlı olarak çekiliyor.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try { await fetch('http://localhost:3001/api/test/trigger-loop', { method: 'POST' }); }
              catch (e) { console.error(e); }
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-5 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-blue-400/30 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Activity size={14} className="animate-pulse" /> AI Döngüsünü Başlat
          </button>
          <button onClick={handleMintAgent} disabled={isMintPending || isMintConfirming || !accountAddress || isWrongNetwork} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30 active:scale-95">
            <Zap size={14} className={isMintPending || isMintConfirming ? 'animate-pulse text-yellow-400' : 'text-emerald-400'} /> Ajan Oluştur
          </button>
        </div>
      </div>

      {/* LIVE STATS - Backend'den gelen gerçek veriler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Kasa TVL (Vault)" value={formattedTVL} subtitle={`Kontrat: ${CONTRACT_ADDRESSES.VAULT.SEPOLIA.slice(0, 10)}...`} icon={<Activity size={20} />} iconColor="text-blue-400" />
        <StatCard title="Dinamik Ücret (Hook)" value={hookData ? hookData.dynamicFee : '—'} subtitle={hookData ? `Mod: ${hookData.protectionMode}` : 'Backend bekleniyor...'} icon={<Zap size={20} />} iconColor="text-yellow-400" />
        <StatCard title="Kasa Durumu" value={hookData ? hookData.status : '—'} subtitle={hookData ? `Hook: ${hookData.name}` : 'Backend bekleniyor...'} icon={<ShieldCheck size={20} />} iconColor="text-emerald-400" />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AI TERMINAL - Backend'den canlı loglar */}
        <div className="lg:col-span-8">
          <section className="bg-black/50 border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-xs text-slate-500 font-mono">ai-neural-loop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`}></div>
                <span className="text-[10px] text-slate-500 font-mono">{backendStatus === 'connected' ? 'LIVE' : 'OFFLINE'}</span>
              </div>
            </div>
            <div className="space-y-2 h-[380px] overflow-y-auto font-mono text-xs custom-scrollbar">
              {logs.length > 0 ? (
                logs.map((log: any) => {
                  const isDecision = log.text.includes('AI_DECISION');
                  const isProof = log.text.includes('PROOF');
                  const isData = log.text.includes('DATA');
                  const isError = log.text.includes('FAIL') || log.text.includes('ERROR');

                  return (
                    <div key={log.id} className={`px-3 py-2 rounded-lg ${isDecision ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : isProof ? 'bg-purple-500/10 border-l-2 border-purple-500' : ''}`}>
                      <span className="text-slate-600 mr-3">[{log.time}]</span>
                      <span className={`${
                        isDecision ? 'text-yellow-400 font-bold' :
                        isProof ? 'text-purple-400 font-bold' :
                        isData ? 'text-blue-400' :
                        isError ? 'text-red-400' :
                        'text-slate-400'
                      }`}>{log.text}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600">
                  <TerminalIcon size={24} />
                  <span className="text-xs">AI döngüsü bekleniyor... &quot;AI Döngüsünü Başlat&quot; butonuna basın.</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* DEPOSIT PANEL */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Kasaya Yatır</h2>
            <p className="text-slate-500 text-xs mb-6">Sepolia ETH yatırarak AI fonuna likidite sağla.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Miktar (ETH)</label>
                <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.01" className="w-full bg-black/40 border border-white/[0.1] rounded-xl py-4 px-5 text-xl font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <button onClick={handleDeposit} disabled={isDepositPending || isDepositConfirming || !accountAddress || !depositAmount || isWrongNetwork} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm disabled:opacity-30">
                {isDepositPending || isDepositConfirming ? 'İşleniyor...' : 'Yatır'} <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* CONTRACT ADDRESSES - Şeffaflık */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Kontrat Adresleri</h4>
            <div className="space-y-3 font-mono text-[10px]">
              <div>
                <span className="text-slate-600 block mb-1">Vault:</span>
                <span className="text-blue-400 break-all">{CONTRACT_ADDRESSES.VAULT.SEPOLIA}</span>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">iNFT:</span>
                <span className="text-emerald-400 break-all">{CONTRACT_ADDRESSES.NFT.SEPOLIA}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatusItem({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-600">{icon}</div>
      <div>
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{label}</div>
        <div className={`text-xs font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconColor: string;
}

function StatCard({ title, value, subtitle, icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl transition-all duration-300 hover:border-white/[0.12]">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-white/[0.04] rounded-lg ${iconColor}`}>{icon}</div>
        <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-[10px] text-slate-600 font-mono">{subtitle}</p>
    </div>
  );
}
