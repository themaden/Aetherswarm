'use client';

import React from 'react';
import { useSwarmAgents } from '@/hooks/useSwarmAgents';
import SwarmStat from './SwarmStat';

export default function SwarmStats() {
  const { agents, isLoading, error } = useSwarmAgents();
  const activeNodes = agents.filter((agent) => agent.status.toLowerCase() === 'active').length;
  const totalNodes = agents.length;

  const stats = [
    {
      title: 'Active Gensyn Nodes',
      value: isLoading ? '...' : error ? 'Offline' : `${activeNodes}/${totalNodes}`,
      color: error ? 'text-red-400' : 'text-blue-500',
    },
    { title: 'AXL Latency', value: '14ms', color: 'text-emerald-500' },
    { title: 'Compute Tunnels', value: 'TEE-Secured', color: 'text-purple-500' },
    {
      title: 'Collective FLOPs',
      value: '12.4 Peta',
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <SwarmStat key={stat.title} title={stat.title} value={stat.value} color={stat.color} />
      ))}
    </div>
  );
}
