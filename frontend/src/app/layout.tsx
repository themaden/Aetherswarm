import '../styles/globals.css';
import React from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Providers } from '../components/shared/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata = {
  title: 'AetherSwarm | Autonomous Black-Box Hedge Fund',
  description: 'Decentralized autonomous Black-Box hedge fund powered by 0G Labs TEE, Gensyn AXL, and Uniswap v4 Hooks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable} bg-[#020205] text-slate-400 font-sans selection:bg-blue-500/25 overflow-hidden`}>
        <Providers>
          {/* ── GLOBAL ATMOSPHERE ── */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-100" />

            {/* Radial vignette */}
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,2,5,0.85) 100%)' }}
            />

            {/* Top-left blue aurora */}
            <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-blue-600/[0.065] blur-[120px] animate-pulse-glow" />

            {/* Bottom-right emerald aurora */}
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.055] blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

            {/* Center-top purple whisper */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-purple-600/[0.035] blur-[100px] animate-float-slow" style={{ animationDelay: '1s' }} />

            {/* Subtle scanline */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-scanline" />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>

          {/* ── APP SHELL ── */}
          <div className="flex h-screen relative z-10">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto px-8 py-7 custom-scrollbar">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
