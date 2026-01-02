'use client';

import { cn } from '@/lib/utils';
import { USER_MESSAGES } from '../../user.text-map';
import type { PasswordStrength } from '../../schemas';

interface PasswordStrengthBarProps {
  strength: PasswordStrength;
  className?: string;
}

const STRENGTH_CONFIG = {
  weak: {
    label: USER_MESSAGES.STRENGTH.WEAK,
    gradient: 'from-red-500 to-red-400',
    textColor: 'text-red-600',
    width: '20%'
  },
  fair: {
    label: USER_MESSAGES.STRENGTH.FAIR,
    gradient: 'from-orange-500 to-amber-400',
    textColor: 'text-orange-600',
    width: '40%'
  },
  good: {
    label: USER_MESSAGES.STRENGTH.GOOD,
    gradient: 'from-amber-500 to-yellow-400',
    textColor: 'text-amber-600',
    width: '60%'
  },
  strong: {
    label: USER_MESSAGES.STRENGTH.STRONG,
    gradient: 'from-lime-500 to-green-400',
    textColor: 'text-lime-600',
    width: '80%'
  },
  // eslint-disable-next-line camelcase
  very_strong: {
    label: USER_MESSAGES.STRENGTH.VERY_STRONG,
    gradient: 'from-green-600 to-emerald-500',
    textColor: 'text-green-600',
    width: '100%'
  }
};

/**
 * Liquid gradient password strength indicator
 * Flows and changes color as password gets stronger
 */
export function PasswordStrengthBar({
  strength,
  className
}: PasswordStrengthBarProps) {
  const config = STRENGTH_CONFIG[strength];

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          {USER_MESSAGES.PASSWORD.STRENGTH_LABEL}
        </span>
        <span className={cn('font-semibold', config.textColor)}>
          {config.label}
        </span>
      </div>

      {/* Liquid gradient bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            config.gradient
          )}
          style={{
            width: config.width,
            boxShadow: '0 0 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s infinite'
            }}
          />
        </div>
      </div>

      {/* Inline shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
