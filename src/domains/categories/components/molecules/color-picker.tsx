'use client';

import { PASTEL_COLORS } from '../../constants/colors';
import { ColorDot } from '../atoms/color-dot';
import { CATEGORIES_MESSAGES } from '../../messages';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

/**
 * ColorPicker - Molecule component
 * Grid of 15 pastel color options for category customization
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        {CATEGORIES_MESSAGES.FORM.COLOR_LABEL}
      </label>
      <div className="grid grid-cols-5 gap-3">
        {PASTEL_COLORS.map(color => (
          <ColorDot
            key={color.id}
            color={color.hex}
            isSelected={value === color.hex}
            onClick={() => onChange(color.hex)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {CATEGORIES_MESSAGES.FORM.COLOR_HELPER}
      </p>
    </div>
  );
}
