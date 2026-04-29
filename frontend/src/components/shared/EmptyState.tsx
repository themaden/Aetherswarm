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
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      {icon || <Package size={48} className="text-slate-600" />}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
