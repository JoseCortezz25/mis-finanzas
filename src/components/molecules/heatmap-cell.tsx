'use client';

import { cn } from '@/lib/utils';
import { formatCurrency, formatDateLong } from '@/lib/utils/format';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

export interface HeatmapCellData {
  date: string;
  amount: number;
  level: 0 | 1 | 2 | 3 | 4;
  transactionCount: number;
  topCategory?: string;
}

export interface HeatmapCellProps {
  /** Cell data */
  data: HeatmapCellData;

  /** Cell size in pixels */
  size?: number;

  /** Callback on click */
  onClick?: (data: HeatmapCellData) => void;

  /** Animation delay for stagger effect */
  animationDelay?: number;
}

const LEVEL_COLORS = {
  0: 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  1: 'bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800',
  2: 'bg-red-200 border-red-300 dark:bg-red-800/40 dark:border-red-700',
  3: 'bg-red-300 border-red-400 dark:bg-red-700/50 dark:border-red-600',
  4: 'bg-red-500 border-red-600 dark:bg-red-600 dark:border-red-500'
} as const;

export function HeatmapCell({
  data,
  size = 14,
  onClick,
  animationDelay = 0
}: HeatmapCellProps) {
  const colorClass = LEVEL_COLORS[data.level];

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'rounded-sm border transition-all duration-150',
            'hover:ring-primary hover:ring-2 hover:ring-offset-1',
            'hover:z-10 hover:scale-110',
            'cursor-pointer',
            'animate-fade-in',
            colorClass
          )}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${animationDelay}ms`
          }}
          onClick={() => onClick?.(data)}
          role="graphics-symbol"
          aria-label={`${formatDateLong(data.date)}: Gastado ${formatCurrency(data.amount)}, ${data.transactionCount} movimientos`}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.(data);
            }
          }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5}>
        <div className="min-w-[180px] text-xs">
          <p className="mb-2 font-semibold">{formatDateLong(data.date)}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Gastado:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(data.amount)}
              </span>
            </div>
            <p className="text-muted-foreground text-[10px]">
              {data.transactionCount}{' '}
              {data.transactionCount === 1 ? 'movimiento' : 'movimientos'}
            </p>
            {data.topCategory && (
              <>
                <Separator className="my-1" />
                <div>
                  <p className="text-muted-foreground text-[10px]">
                    Categoría principal:
                  </p>
                  <p className="font-medium">{data.topCategory}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
