'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationInputProps {
  expectedText: string;
  label: string;
  placeholder?: string;
  onMatch: (isMatch: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Input with real-time validation indicator
 * Shows visual feedback when text matches expected value
 */
export function ConfirmationInput({
  expectedText,
  label,
  placeholder,
  onMatch,
  value,
  onChange
}: ConfirmationInputProps) {
  const isMatch = value === expectedText;
  const hasValue = value.length > 0;

  // Notify parent of match status
  if (isMatch !== undefined) {
    onMatch(isMatch);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="confirmation" className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id="confirmation"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'pr-10 font-mono text-sm transition-all',
            isMatch && 'border-green-500 focus-visible:ring-green-500',
            hasValue && !isMatch && 'border-red-300 focus-visible:ring-red-300'
          )}
          autoComplete="off"
        />
        {/* Match indicator */}
        {hasValue && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {isMatch ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-400" />
            )}
          </div>
        )}
      </div>
      {hasValue && !isMatch && (
        <p className="text-xs text-red-600">
          Debe escribir exactamente:{' '}
          <span className="font-mono font-semibold">{expectedText}</span>
        </p>
      )}
    </div>
  );
}
