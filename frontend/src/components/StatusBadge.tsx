import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'approved' | 'rejected' | 'open' | 'submitted' | 'won' | 'lost';
}

const statusConfig = {
  paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  submitted: { label: 'Submitted', className: 'bg-purple-100 text-purple-700 hover:bg-purple-100' },
  won: { label: 'Won', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  lost: { label: 'Lost', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={`${config.className} rounded-full px-3 py-1`}>
      {config.label}
    </Badge>
  );
}
