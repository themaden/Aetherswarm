import React from 'react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'No data available',
  description = 'There is no data to display right now.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
        {icon || <Package size={40} className="text-slate-600" />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-slate-500 text-sm max-w-sm">{description}</p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
