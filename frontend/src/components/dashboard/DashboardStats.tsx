'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';

export default function DashboardStats() {
  const stats = [
    { title: 'Total Value Locked', value: '$1.24M', change: '+4.2% this week', changeType: 'positive' as const, icon: <TrendingUp size={20} /> },
    { title: 'Daily P&L', value: '+$8,432', change: '+12% vs yesterday', changeType: 'positive' as const },
    { title: 'Active Positions', value: '23', change: '5 newly opened', changeType: 'neutral' as const },
    { title: 'Win Rate', value: '67%', change: '12 wins / 6 losses', changeType: 'positive' as const },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
