import React from 'react';

interface SwarmStatProps {
  title: string;
  value: string;
  color: string;
}

export default function SwarmStat({ title, value, color }: SwarmStatProps) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
      <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{title}</h4>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
