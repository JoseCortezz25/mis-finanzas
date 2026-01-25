import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'income' | 'expense' | 'balance';
  isLoading?: boolean;
}

const variantStyles = {
  income: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700'
  },
  expense: {
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700'
  },
  balance: {
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700'
  }
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  variant,
  isLoading = false
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className="flex flex-col gap-0 rounded-[25px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 py-6"
      style={{
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-6 flex size-[60px] items-center justify-center rounded-lg',
          styles.iconBg
        )}
      >
        <Icon className={cn('size-[28px]', styles.iconColor)} />
      </div>

      {/* Label */}
      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label}
      </p>

      {/* Value */}
      <div className="mt-2 mb-6">
        {isLoading ? (
          <div className="h-14 w-48 animate-pulse rounded-md bg-slate-200"></div>
        ) : (
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            $ {value.toLocaleString('es-CO')}
          </p>
        )}
      </div>
    </div>
  );
}
