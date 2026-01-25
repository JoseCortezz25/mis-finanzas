import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BudgetHealthStatus } from '../types';
import { DASHBOARD_MESSAGES } from '../messages';

interface BudgetHealthBadgeProps {
  healthStatus: BudgetHealthStatus;
  className?: string;
}

/**
 * Budget health status badge with flat color palette
 * Uses icon + color + text for accessibility (color-independent)
 */
export function BudgetHealthBadge({
  healthStatus,
  className
}: BudgetHealthBadgeProps) {
  const config = {
    healthy: {
      icon: CheckCircle2,
      label: DASHBOARD_MESSAGES.ACTIVE_BUDGETS.HEALTH.HEALTHY,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-500'
    },
    warning: {
      icon: AlertTriangle,
      label: DASHBOARD_MESSAGES.ACTIVE_BUDGETS.HEALTH.WARNING,
      className: 'bg-amber-50 text-amber-700 border-amber-500'
    },
    exceeded: {
      icon: XCircle,
      label: DASHBOARD_MESSAGES.ACTIVE_BUDGETS.HEALTH.EXCEEDED,
      className: 'bg-red-50 text-red-700 border-red-500'
    }
  }[healthStatus];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 px-2.5 py-1 text-xs font-medium',
        config.className,
        className
      )}
      aria-label={`${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.TOOLTIP.HEALTH}: ${config.label}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{config.label}</span>
    </Badge>
  );
}
