'use client';

import { describeArc } from '@/lib/utils/svg';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export interface GaugeSegment {
  type: 'egreso' | 'gasto' | 'ingreso';
  label: string;
  amount: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface SemicircularGaugeProps {
  /** Current balance amount */
  balance: number;

  /** Needle angle in degrees (0-180) */
  needleAngle: number;

  /** Gauge segments with start/end angles and colors */
  segments: GaugeSegment[];

  /** Gauge diameter */
  diameter?: number;

  /** Gauge thickness */
  thickness?: number;

  /** Callbacks */
  onSegmentHover?: (segment: GaugeSegment) => void;
  onNeedleHover?: () => void;

  /** Accessibility */
  ariaLabel?: string;
}

export function SemicircularGauge({
  balance,
  needleAngle,
  segments,
  diameter = 280,
  thickness = 32,
  onSegmentHover,
  onNeedleHover,
  ariaLabel = 'Medidor de balance financiero'
}: SemicircularGaugeProps) {
  const radius = diameter / 2 - thickness / 2;
  const cx = diameter / 2;
  const cy = diameter / 2;

  return (
    <svg
      width={diameter}
      height={diameter / 2 + 40}
      viewBox={`0 0 ${diameter} ${diameter / 2 + 40}`}
      className="mx-auto"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Background arc */}
      <path
        d={describeArc(cx, cy, radius, 0, 180)}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={thickness}
        strokeLinecap="round"
        opacity={0.2}
      />

      {/* Colored segments */}
      {segments.map((segment, index) => (
        <Tooltip key={`${segment.type}-${index}`}>
          <TooltipTrigger asChild>
            <path
              d={describeArc(
                cx,
                cy,
                radius,
                segment.startAngle,
                segment.endAngle
              )}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300 hover:opacity-80"
              onMouseEnter={() => onSegmentHover?.(segment)}
              role="graphics-symbol"
              aria-label={`${segment.label}: ${formatCurrency(segment.amount)}, ${segment.percentage.toFixed(1)}% del total`}
              tabIndex={0}
            />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={5}>
            <div className="min-w-[140px] text-xs">
              <p className="mb-1 font-semibold">{segment.label}</p>
              <p className="text-muted-foreground">
                {formatCurrency(segment.amount)}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px]">
                {segment.percentage.toFixed(1)}% del total
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Needle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <g
            transform={`rotate(${needleAngle - 90}, ${cx}, ${cy})`}
            className="cursor-pointer transition-transform duration-500 ease-out"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            onMouseEnter={onNeedleHover}
          >
            {/* Needle line */}
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - radius + 10}
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle tip (triangle) */}
            <polygon
              points={`${cx},${cy - radius + 10} ${cx - 4},${cy - radius + 18} ${cx + 4},${cy - radius + 18}`}
              fill="hsl(var(--foreground))"
            />
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10}>
          <div className="text-xs">
            <p className="mb-1 font-semibold">Balance</p>
            <p
              className={cn(
                'text-base font-semibold',
                balance >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Center pivot */}
      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill="hsl(var(--card))"
        stroke="hsl(var(--foreground))"
        strokeWidth="3"
      />

      {/* Scale labels */}
      <text
        x={cx - radius + 10}
        y={cy + 30}
        className="fill-muted-foreground text-xs"
        textAnchor="start"
      >
        Min
      </text>
      <text
        x={cx}
        y={cy + 30}
        className="fill-muted-foreground text-xs"
        textAnchor="middle"
      >
        50%
      </text>
      <text
        x={cx + radius - 10}
        y={cy + 30}
        className="fill-muted-foreground text-xs"
        textAnchor="end"
      >
        Max
      </text>
    </svg>
  );
}
