// frontend/src/app/layout.tsx
import '../styles/globals.css';
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header'; // We will create this next

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
      <body className="bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
        
        {/* GLOBAL BACKGROUND EFFECTS */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        </div>

        {/* APP STRUCTURE */}
        <div className="flex h-screen relative z-10">
          {/* PERSISTENT SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
            {/* We will add the Header here in the next step */}
            
            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {children}
            </main>
          </div>
        </div>

      </body>
    </html>
  );
}