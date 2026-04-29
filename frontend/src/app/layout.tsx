// frontend/src/app/layout.tsx
import '../styles/globals.css';
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNav from '../components/layout/MobileNav';

export const metadata = {
  title: 'AetherSwarm | AI Hedge Fund',
  description: 'Decentralized autonomous Black-Box hedge fund powered by 0G Labs and Uniswap v4.',
};

/**
 * @title Root Layout
 * @dev Wraps all pages with the persistent Sidebar and Header.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#030308] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden">
        
        {/* GLOBAL BACKGROUND EFFECTS */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Primary ambient glow */}
          <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.07] blur-[150px] rounded-full animate-pulse-glow"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/[0.06] blur-[150px] rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Secondary accent glow */}
          <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-purple-600/[0.04] blur-[120px] rounded-full animate-float"></div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>

        {/* APP STRUCTURE */}
        <div className="flex h-screen relative z-10">
          {/* PERSISTENT SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 ml-64 md:ml-64 flex flex-col h-screen overflow-hidden">
            {/* HEADER */}
            <Header />
            
            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {children}
            </main>
          </div>

          {/* MOBILE NAVIGATION */}
          <MobileNav />
        </div>

      </body>
    </html>
  );
}