'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ColorDotProps {
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ColorDot - Atom component
 * Circular color selector button with visual feedback
 */
export function ColorDot({
  color,
  isSelected,
  onClick,
  size = 'md'
}: ColorDotProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-2xl transition-all',
        sizeClasses,
        isSelected
          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
          : 'border-gray-200 hover:border-gray-400'
      )}
      style={{ backgroundColor: color }}
      aria-label={`Color ${color}`}
    >
      {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
    </button>
  );
}
