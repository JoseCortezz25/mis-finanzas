'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface DateRangeSelectorProps {
  /** Current selected range */
  value: string;

  /** Callback when range changes */
  onChange: (range: string) => void;

  /** Available range options */
  options?: Array<{
    value: string;
    label: string;
  }>;

  /** Width className */
  className?: string;
}

const DEFAULT_OPTIONS = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Últimos 12 meses' }
];

export function DateRangeSelector({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = 'w-[200px]'
}: DateRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Seleccionar rango" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
