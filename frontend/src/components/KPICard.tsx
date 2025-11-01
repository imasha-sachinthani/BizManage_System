import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, FileText, CreditCard } from 'lucide-react';
import { Card } from './ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: 'revenue' | 'invoices' | 'pending' | 'expenses';
  gradient: string;
}

const iconMap = {
  revenue: DollarSign,
  invoices: FileText,
  pending: CreditCard,
  expenses: TrendingUp,
};

export function KPICard({ title, value, change, trend, icon, gradient }: KPICardProps) {
  const Icon = iconMap[icon];
  const isPositive = trend === 'up';
  
  return (
    <Card className={`p-6 ${gradient} text-white card-hover cursor-pointer border-0 shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
          isPositive ? 'bg-white/20' : 'bg-black/20'
        }`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div>
        <p className="text-white/80 text-sm mb-1">{title}</p>
        <p className="text-3xl mt-2">{value}</p>
      </div>
    </Card>
  );
}
