'use client';

import { cn } from '@/lib/utils';
import { getIconById, DEFAULT_ICON } from '../../constants/icons';
import { DEFAULT_COLOR } from '../../constants/colors';
import type { Category } from '@/lib/repositories/category-repository';

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'icon' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * CategoryBadge - Molecule component
 * Displays category with icon, name, and color styling
 */
export function CategoryBadge({
  category,
  size = 'md',
  className
}: CategoryBadgeProps) {
  const iconData = getIconById(category.icon || DEFAULT_ICON.id);
  const IconComponent = iconData.component;
  const categoryColor = category.color || DEFAULT_COLOR.hex;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2'
  }[size];

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  }[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses,
        className
      )}
      style={{
        backgroundColor: `${categoryColor}20`,
        color: categoryColor
      }}
    >
      <IconComponent size={iconSizes} strokeWidth={2} />
      <span>{category.name}</span>
    </div>
  );
}
