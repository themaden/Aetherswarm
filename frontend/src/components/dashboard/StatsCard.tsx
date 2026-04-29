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
    positive: 'text-emerald-500',
    negative: 'text-red-500',
    neutral: 'text-slate-500',
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <p className="text-3xl font-black text-white mb-2">{value}</p>
      {change && <p className={`text-xs font-semibold ${changeColorMap[changeType]}`}>{change}</p>}
    </div>
  );
}
