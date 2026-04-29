import React from 'react';

interface SwarmStatProps {
  title: string;
  value: string;
  color: string;
}

export default function SwarmStat({ title, value, color }: SwarmStatProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 group hover-lift">
      <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold mb-2">{title}</h4>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}
