'use client';

import React from 'react';
import iNFTCard from './iNFTCard';

const AGENTS = [
  { id: '#001', name: 'Aether_Prime', type: 'Strategy Master', memory: 'QmX8...4v2', health: '99%' },
  { id: '#002', name: 'LVR_Sentinel', type: 'Hook Guardian', memory: 'QmTz...9a1', health: '100%' },
  { id: '#003', name: 'Liquidity_Seeker', type: 'Arbitrage Scanner', memory: 'QmPw...7r3', health: '94%' },
];

export default function iNFTGalleryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {AGENTS.map((agent) => (
        <iNFTCard
          key={agent.id}
          id={agent.id}
          name={agent.name}
          type={agent.type}
          memory={agent.memory}
          health={agent.health}
        />
      ))}
    </div>
  );
}
