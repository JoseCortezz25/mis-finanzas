'use client';

import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
}

export function CategorySelector({
  value,
  onChange,
  disabled = false
}: CategorySelectorProps) {
  return (
    <div className="category-selector">
      <label className="category-selector__label">CATEGORÍA</label>
      <div className="category-selector__grid">
        {BUDGET_CATEGORIES.map(category => {
          const Icon = category.icon;
          const isSelected = value === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              disabled={disabled}
              className={cn(
                'category-selector__item',
                isSelected && 'category-selector__item--selected',
                disabled && 'category-selector__item--disabled'
              )}
            >
              <div className="category-selector__icon-wrapper">
                <div
                  className={cn('category-selector__icon-bg', category.bgColor)}
                />
                <Icon
                  className={cn('category-selector__icon', category.iconColor)}
                  size={24}
                  strokeWidth={2}
                />
              </div>
              <span className="category-selector__label-text">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
