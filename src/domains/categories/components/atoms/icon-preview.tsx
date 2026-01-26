'use client';

import { cn } from '@/lib/utils';
import type { IconOption } from '../../constants/icons';

interface IconPreviewProps {
  icon: IconOption;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * IconPreview - Atom component
 * Icon button with label for category selection
 */
export function IconPreview({ icon, isSelected, onClick }: IconPreviewProps) {
  const IconComponent = icon.component;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
      )}
      aria-label={icon.label}
    >
      <IconComponent className="size-5" strokeWidth={1.5} />
      <span className="text-xs font-medium text-gray-600">{icon.label}</span>
    </button>
  );
}
