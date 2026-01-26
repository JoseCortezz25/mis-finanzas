'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AVAILABLE_ICONS } from '../../constants/icons';
import { IconPreview } from '../atoms/icon-preview';
import { CATEGORIES_MESSAGES } from '../../messages';

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
}

/**
 * IconPicker - Molecule component
 * Searchable grid of categorized icons with tabs
 */
export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = AVAILABLE_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <label className="mb-4 text-sm font-medium text-gray-700">
        {CATEGORIES_MESSAGES.FORM.ICON_LABEL}
      </label>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={CATEGORIES_MESSAGES.FORM.ICON_SEARCH_PLACEHOLDER}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 overflow-y-auto md:max-h-[200px] md:grid-cols-5">
        {filteredIcons.map(icon => (
          <IconPreview
            key={icon.id}
            icon={icon}
            isSelected={value === icon.id}
            onClick={() => onChange(icon.id)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {CATEGORIES_MESSAGES.FORM.ICON_HELPER}
      </p>
    </div>
  );
}
