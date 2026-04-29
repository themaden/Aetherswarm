'use client';

import React from 'react';
import SwarmStat from './SwarmStat';

export default function SwarmStats() {
  const stats = [
    { title: 'Active Nodes', value: '12', color: 'text-blue-500' },
    { title: 'Network Latency', value: '42ms', color: 'text-emerald-500' },
    { title: 'Encrypted Tunnels', value: 'TLS 1.3', color: 'text-purple-500' },
    { title: 'Total Signals (24h)', value: '14,204', color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <SwarmStat key={stat.title} title={stat.title} value={stat.value} color={stat.color} />
      ))}
    </div>
  );
}
