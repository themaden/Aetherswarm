'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, Image as ImageIcon, Zap, Lock, Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Swarm Intelligence', path: '/swarm', icon: <Globe size={20} /> },
    { name: 'iNFT Gallery', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Execution Engine', path: '/execution', icon: <Zap size={20} /> },
    { name: 'Swarm Vault', path: '/vault', icon: <Lock size={20} /> },
  ];

  return (
    <>
      {/* MOBILE NAV BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-2 p-6 h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.name} href={item.path}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}