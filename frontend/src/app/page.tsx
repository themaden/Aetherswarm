"use client";

import React, { type ReactNode, useMemo, useRef, useEffect, useState } from 'react';
import {
  Activity, ShieldCheck, Cpu, Zap, Lock, TrendingUp,
  ArrowUpRight, Wallet, Globe2, Layers, CreditCard, BrainCircuit,
  Terminal, GitBranch, Signal, ChevronRight
} from 'lucide-react';
import { useBalance, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import VaultABI from '@/abis/AetherSwarmVault.json';
import iNFTABI from '@/abis/AetherSwarmiNFT.json';
import { sepolia } from 'wagmi/chains';

// ═══════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════
export default function CommandCenter() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [depositAmt, setDepositAmt] = useState('');
  const [backendOk, setBackendOk] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [hookData, setHookData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const poll = async () => {
      try {
        const [hr, lr, ar] = await Promise.all([
          fetch('http://localhost:3001/api/execution/hooks'),
          fetch('http://localhost:3001/api/logs'),
          fetch('http://localhost:3001/api/agents'),
        ]);
        setHookData((await hr.json()).hook);
        setLogs((await lr.json()).logs || []);
        setAgents((await ar.json()).agents || []);
        setBackendOk(true);
      } catch { setBackendOk(false); }
    };
    poll();
    const iv = setInterval(poll, 2000);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll disabled — keep page position stable

  /* ── On-chain ── */
  const { data: vaultBal, refetch: refetchVault } = useBalance({
    address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
    query: { enabled: mounted },
  });
  const { data: userBal } = useBalance({
    address,
    query: { enabled: mounted && !!address },
  });
  const { data: agentCnt, refetch: refetchAgents } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
    abi: iNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: mounted && !!address && chainId === sepolia.id },
  });

  const { data: mintHash, writeContract: doMint, isPending: mintPending } = useWriteContract();
  const { data: depHash, writeContract: doDeposit, isPending: depPending } = useWriteContract();
  const { isLoading: mintConfirming, isSuccess: mintDone } = useWaitForTransactionReceipt({ hash: mintHash });
  const { isLoading: depConfirming, isSuccess: depDone } = useWaitForTransactionReceipt({ hash: depHash });

  useEffect(() => { if (mintDone) refetchAgents(); }, [mintDone, refetchAgents]);
  useEffect(() => { if (depDone) { refetchVault(); setDepositAmt(''); } }, [depDone, refetchVault]);

  const tvl = useMemo(() => {
    if (!mounted || !vaultBal) return '0.0000';
    return parseFloat(formatEther(vaultBal.value)).toFixed(4);
  }, [vaultBal, mounted]);

  const userEth = useMemo(() => {
    if (!mounted || !userBal) return '—';
    return `${parseFloat(formatEther(userBal.value)).toFixed(4)} ETH`;
  }, [userBal, mounted]);

  const agentNum = useMemo(() => {
    if (!mounted || agentCnt == null) return '0';
    return agentCnt.toString();
  }, [agentCnt, mounted]);

  const shortAddr = address ? `${address.slice(0, 6)}···${address.slice(-4)}` : null;
  const wrongNet = address && chainId !== sepolia.id;

  const trigger = async () => {
    setTriggering(true);
    try { 
      await fetch('http://localhost:3001/api/test/trigger-loop', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address || "0xDisconnected" })
      }); 
    } catch { /* */ }
    setTimeout(() => setTriggering(false), 3500);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-5">

      {/* ── WRONG NETWORK ── */}
      {wrongNet && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-3.5 flex items-center justify-between fade-in">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-xs text-amber-200/80">Wrong network — switch to <span className="font-bold text-white">Sepolia Testnet</span></p>
          </div>
          <button onClick={() => switchChain({ chainId: sepolia.id })}
            className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-all active:scale-95">
            Switch
          </button>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl fade-in-up"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,25,0.9) 0%, rgba(5,5,15,0.95) 100%)',
          border: '1px solid rgba(59,130,246,0.12)',
        }}>
        {/* Decorative right-side glow */}
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-600/[0.06] to-transparent" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-emerald-500/[0.06] blur-3xl" />

        {/* Dot pattern */}
        <div className="absolute right-0 top-0 w-1/2 h-full dot-pattern opacity-40" />

        {/* Decorative hex */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 clip-hex bg-gradient-to-br from-blue-500/[0.08] to-emerald-500/[0.08] border border-blue-500/[0.15] flex items-center justify-center hidden lg:flex">
          <BrainCircuit size={28} className="text-blue-400/40" />
        </div>

        <div className="relative z-10 px-7 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">Autonomous Black-Box Hedge Fund</span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Command <span className="gradient-text-blue">Center</span>
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              AI decisions sealed in <span className="text-cyan-400 font-semibold">0G Labs TEE</span> ·
              mesh via <span className="text-purple-400 font-semibold">Gensyn AXL</span> ·
              executed through <span className="text-blue-400 font-semibold">Uniswap v4 Hooks</span>
            </p>

            {/* Mini status row */}
            <div className="flex items-center gap-4 mt-3">
              <MiniStatus
                active={isConnected}
                label={isConnected ? shortAddr! : 'No Wallet'}
                icon={<Wallet size={10} />}
              />
              <MiniStatus
                active={backendOk}
                label={backendOk ? 'Backend Live' : 'Backend Off'}
                icon={<Signal size={10} />}
              />
              <MiniStatus
                active={chainId === sepolia.id}
                label="Sepolia"
                icon={<Globe2 size={10} />}
              />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 shrink-0">
            <button onClick={trigger} disabled={triggering || !backendOk}
              className="group relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white overflow-hidden transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                boxShadow: '0 4px 24px rgba(29,78,216,0.35)',
              }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Activity size={15} className={`relative z-10 ${triggering ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="relative z-10">{triggering ? 'Executing...' : '▶  Trigger AI Cycle'}</span>
            </button>

            <button onClick={() => doMint({
              address: CONTRACT_ADDRESSES.NFT.SEPOLIA as `0x${string}`,
              abi: iNFTABI, functionName: 'mintAgent',
              args: [address!, 'ipfs://QmDefaultModelCID'],
            })} disabled={mintPending || mintConfirming || !address || !!wrongNet}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider text-slate-300 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all active:scale-95 disabled:opacity-30">
              <Cpu size={13} className={mintPending || mintConfirming ? 'animate-pulse text-yellow-400' : 'text-emerald-400'} />
              Mint iNFT Agent
            </button>
          </div>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fade-in-up fade-in-up-1">
        <MetricCard label="Vault TVL" value={`${tvl} ETH`} icon={<Lock size={16} />} accent="blue" suffix="On-Chain" />
        <MetricCard label="Your Balance" value={userEth} icon={<Wallet size={16} />} accent="emerald" suffix="Sepolia" />
        <MetricCard label="Dynamic Fee" value={hookData?.dynamicFee ?? '—'} icon={<TrendingUp size={16} />} accent="amber" suffix={hookData?.protectionMode ?? 'LVR'} />
        <MetricCard label="iNFT Agents" value={agentNum} icon={<Cpu size={16} />} accent="purple" suffix="Minted" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 fade-in-up fade-in-up-2">

        {/* ── AI TERMINAL ── */}
        <div className="lg:col-span-8">
          <div className="h-full rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'rgba(3,3,8,0.98)', border: '1px solid rgba(255,255,255,0.05)' }}>

            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] shrink-0"
              style={{ background: 'rgba(255,255,255,0.012)' }}>
              <div className="flex items-center gap-5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-slate-700" />
                  <span className="text-[10px] font-mono text-slate-700 tracking-wide">aetherswarm ~ neural-intelligence-loop</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${backendOk ? 'bg-emerald-400 animate-pulse' : 'bg-red-500/60'}`} />
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${backendOk ? 'text-emerald-600' : 'text-red-700'}`}>
                  {backendOk ? 'LIVE STREAM' : 'OFFLINE'}
                </span>
              </div>
            </div>

            {/* Log area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5 font-mono text-[11px] custom-scrollbar min-h-[300px] max-h-[400px]">
              {logs.length > 0 ? (
                [...logs].reverse().map((log: any) => {
                  const t: string = log.text;
                  let cls = 'text-slate-700';
                  let bg = '';
                  let prefix = '';

                  if (t.includes('AI_DECISION'))  { cls = 'text-amber-300 font-semibold'; bg = 'bg-amber-500/[0.04] border-l-2 border-amber-500/40'; prefix = '▶ '; }
                  else if (t.includes('PROOF'))         { cls = 'text-purple-300 font-semibold'; bg = 'bg-purple-500/[0.04] border-l-2 border-purple-500/40'; prefix = '◆ '; }
                  else if (t.includes('TEE_ENCLAVE') || t.includes('Sealed') || t.includes('Attestation')) { cls = 'text-cyan-400'; }
                  else if (t.includes('BLOCKCHAIN') || t.includes('Hook Updated')) { cls = 'text-emerald-400'; }
                  else if (t.includes('x402') || t.includes('Payment')) { cls = 'text-emerald-300'; }
                  else if (t.includes('0G_STORAGE')) { cls = 'text-blue-400'; }
                  else if (t.includes('DATA') || t.includes('Fetching') || t.includes('Price')) { cls = 'text-blue-400/60'; }
                  else if (t.includes('DEEPSEEK') || t.includes('Neural')) { cls = 'text-violet-400'; }
                  else if (t.includes('WEB3') || t.includes('Wallet')) { cls = 'text-slate-500'; }
                  else if (t.includes('FAIL') || t.includes('ERROR'))  { cls = 'text-red-400'; }
                  else { cls = 'text-slate-600'; }

                  return (
                    <div key={log.id} className={`flex gap-2 py-1 px-2 rounded transition-colors hover:bg-white/[0.015] ${bg}`}>
                      <span className="text-slate-800 shrink-0 select-none">[{log.time}]</span>
                      <span className={cls}>{prefix}{t}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-800 py-16">
                  <Terminal size={28} strokeWidth={1} />
                  <div className="text-center">
                    <p className="text-xs">Intelligence loop idle</p>
                    <p className="text-[10px] mt-1 text-slate-900">Press <span className="text-blue-700">▶ Trigger AI Cycle</span> above</p>
                  </div>
                </div>
              )}
              <div ref={logRef} />
            </div>

            {/* Terminal footer */}
            <div className="px-5 py-2.5 border-t border-white/[0.03] flex items-center justify-between shrink-0">
              <span className="text-[9px] font-mono text-slate-800">{logs.length} events · 2s refresh</span>
              <div className="flex items-center gap-3 text-[9px] font-mono text-slate-800">
                <span><span className="text-amber-600">▶</span> Decision</span>
                <span><span className="text-purple-600">◆</span> Proof</span>
                <span><span className="text-cyan-700">●</span> TEE</span>
                <span><span className="text-emerald-700">●</span> Chain</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* DEPOSIT */}
          <Panel label="Deposit to Vault" icon={<Lock size={14} className="text-emerald-400" />}>
            <p className="text-[10px] text-slate-700 mb-3">Send Sepolia ETH to the AI-managed fund vault</p>
            <input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)}
              placeholder="0.01"
              className="w-full bg-black/50 border border-white/[0.07] rounded-xl py-3 px-4 text-xl font-black text-white placeholder:text-slate-900 focus:outline-none focus:border-blue-500/40 font-mono transition-all mb-3" />
            <button onClick={() => doDeposit({
              address: CONTRACT_ADDRESSES.VAULT.SEPOLIA as `0x${string}`,
              abi: VaultABI, functionName: 'depositETH',
              value: parseEther(depositAmt || '0'),
            })} disabled={depPending || depConfirming || !address || !depositAmt || !!wrongNet}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 20px rgba(16,185,129,0.2)' }}>
              {depPending || depConfirming ? 'Processing...' : 'Deposit ETH'} <ArrowUpRight size={13} />
            </button>
          </Panel>

          {/* PROTOCOL STACK */}
          <Panel label="Protocol Stack" icon={<Layers size={14} className="text-blue-400" />}>
            <div className="space-y-0.5">
              <StackRow icon={<ShieldCheck size={11} />} label="0G Labs TEE" sublabel="Sealed Inference" color="cyan" status="active" />
              <StackRow icon={<GitBranch size={11} />} label="Gensyn AXL" sublabel="P2P Ghost Swarm" color="purple" status="active" />
              <StackRow icon={<Zap size={11} />} label="Uniswap v4" sublabel="SwarmHook · LVR" color="blue" status="active" />
              <StackRow icon={<CreditCard size={11} />} label="x402 Protocol" sublabel="Agent Payments" color="emerald" status="sim" />
              <StackRow icon={<BrainCircuit size={11} />} label="DeepSeek AI" sublabel="Neural Engine" color="violet" status="active" />
            </div>
          </Panel>

          {/* AGENT MESH */}
          <Panel label={`Agent Mesh (${agents.filter(a => a.status === 'Active').length}/${agents.length})`} icon={<Signal size={14} className="text-purple-400" />}>
            <div className="space-y-1.5">
              {agents.slice(0, 5).map((a: any) => (
                <div key={a.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-slate-700'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{a.name}</p>
                    <p className="text-[9px] text-slate-700 truncate">{a.role}</p>
                  </div>
                  <span className="text-[8px] font-mono text-slate-800 shrink-0">{a.location}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* CONTRACTS */}
          <Panel label="Deployed Contracts" icon={<ChevronRight size={14} className="text-slate-600" />}>
            <div className="space-y-2 font-mono text-[9px]">
              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-700 font-bold uppercase tracking-wider">Vault</span>
                <div className="break-all text-blue-400/70 leading-relaxed">{CONTRACT_ADDRESSES.VAULT.SEPOLIA}</div>
              </div>
              <div className="border-t border-white/[0.04] pt-2 space-y-0.5">
                <span className="text-[8px] text-slate-700 font-bold uppercase tracking-wider">iNFT</span>
                <div className="break-all text-emerald-400/70 leading-relaxed">{CONTRACT_ADDRESSES.NFT.SEPOLIA}</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════

function MiniStatus({ active, label, icon }: { active: boolean; label: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`${active ? 'text-emerald-400' : 'text-slate-700'}`}>{icon}</div>
      <span className={`text-[9px] font-bold ${active ? 'text-emerald-400' : 'text-slate-700'}`}>{label}</span>
    </div>
  );
}

const accentMap = {
  blue:    { text: 'text-blue-400',    border: 'border-blue-500/15',    glow: 'from-blue-500/5'    },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/15', glow: 'from-emerald-500/5' },
  amber:   { text: 'text-amber-400',   border: 'border-amber-500/15',   glow: 'from-amber-500/5'   },
  purple:  { text: 'text-purple-400',  border: 'border-purple-500/15',  glow: 'from-purple-500/5'  },
};

function MetricCard({ label, value, icon, accent, suffix }: {
  label: string; value: string; icon: ReactNode; accent: keyof typeof accentMap; suffix: string;
}) {
  const c = accentMap[accent];
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${c.border} bg-white/[0.018] p-4 group hover-lift gradient-border-animated`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className={`${c.text} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">{label}</span>
        </div>
        <p className="text-xl font-black text-white mb-0.5">{value}</p>
        <p className="text-[9px] font-mono text-slate-700">{suffix}</p>
      </div>
    </div>
  );
}

function Panel({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.018] p-4 hover:border-white/[0.09] transition-colors">
      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.04]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
      </div>
      {children}
    </div>
  );
}

const stackColorMap: Record<string, { dot: string; text: string }> = {
  cyan:    { dot: 'bg-cyan-400',    text: 'text-cyan-400'    },
  purple:  { dot: 'bg-purple-400',  text: 'text-purple-400'  },
  blue:    { dot: 'bg-blue-400',    text: 'text-blue-400'    },
  emerald: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  violet:  { dot: 'bg-violet-400',  text: 'text-violet-400'  },
};

function StackRow({ icon, label, sublabel, color, status }: {
  icon: ReactNode; label: string; sublabel: string; color: string; status: 'active' | 'sim';
}) {
  const c = stackColorMap[color] ?? stackColorMap.blue;
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <div className={`${c.text} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-white">{label}</p>
        <p className="text-[9px] text-slate-700">{sublabel}</p>
      </div>
      <span className={`text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
        status === 'active'
          ? `${c.text} border-current opacity-60`
          : 'text-amber-600 border-amber-700/30'
      }`}>{status === 'active' ? 'Live' : 'Sim'}</span>
    </div>
  );
}
