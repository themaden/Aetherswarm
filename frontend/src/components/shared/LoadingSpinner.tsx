import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 64,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 size={sizeMap[size]} className="text-blue-400 animate-spin" />
        {/* Glow behind spinner */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
      </div>
      {message && <p className="text-slate-500 text-sm font-medium">{message}</p>}
    </div>
  );
}
