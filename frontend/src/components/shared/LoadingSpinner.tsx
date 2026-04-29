import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 size={size === 'sm' ? 24 : size === 'md' ? 40 : 64} className="text-blue-500 animate-spin" />
      {message && <p className="text-slate-400 text-sm">{message}</p>}
    </div>
  );
}
