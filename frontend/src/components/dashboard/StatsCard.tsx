import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, change, changeType = 'neutral', icon }: StatsCardProps) {
  const changeColorMap = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10',
    negative: 'text-red-400 bg-red-500/10 border-red-500/10',
    neutral: 'text-slate-400 bg-white/[0.04] border-white/[0.06]',
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden hover-lift">
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">{title}</h3>
        {icon && <div className="text-blue-400 p-2 bg-white/[0.04] rounded-xl border border-white/[0.06] group-hover:border-blue-500/20 transition-colors duration-300">{icon}</div>}
      </div>
      <p className="text-3xl font-extrabold text-white mb-2.5 relative z-10">{value}</p>
      {change && (
        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg border ${changeColorMap[changeType]}`}>
          {changeType === 'positive' && '↑ '}
          {changeType === 'negative' && '↓ '}
          {change}
        </span>
      )}
    </div>
  );
}
