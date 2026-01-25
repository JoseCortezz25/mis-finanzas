'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const iconsByCategory = {
    all: filteredIcons,
    general: filteredIcons.filter(i => i.category === 'general'),
    transport: filteredIcons.filter(i => i.category === 'transport'),
    food: filteredIcons.filter(i => i.category === 'food'),
    lifestyle: filteredIcons.filter(i => i.category === 'lifestyle'),
    money: filteredIcons.filter(i => i.category === 'money')
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">
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

      {/* Category tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="transport">Transporte</TabsTrigger>
          <TabsTrigger value="food">Comida</TabsTrigger>
          <TabsTrigger value="lifestyle">Estilo</TabsTrigger>
          <TabsTrigger value="money">Dinero</TabsTrigger>
        </TabsList>

        {Object.entries(iconsByCategory).map(([key, icons]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid max-h-[300px] grid-cols-4 gap-3 overflow-y-auto">
              {icons.map(icon => (
                <IconPreview
                  key={icon.id}
                  icon={icon}
                  isSelected={value === icon.id}
                  onClick={() => onChange(icon.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-xs text-gray-500">
        {CATEGORIES_MESSAGES.FORM.ICON_HELPER}
      </p>
    </div>
  );
}
