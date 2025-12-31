'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  disabled = false,
  placeholder = '0'
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value, isFocused]);

  const formatCurrency = (amount: number): string => {
    if (amount === 0) return '0';
    return amount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value === 0 ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numericValue = parseFloat(displayValue.replace(/[^\d]/g, '')) || 0;
    onChange(numericValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow numbers
    const numericValue = input.replace(/[^\d]/g, '');
    setDisplayValue(numericValue);

    // Update parent with numeric value
    const parsedValue = parseFloat(numericValue) || 0;
    onChange(parsedValue);
  };

  return (
    <div className="currency-input">
      <label className="currency-input__label">LÍMITE MENSUAL</label>
      <div
        className={cn(
          'currency-input__wrapper',
          isFocused && 'currency-input__wrapper--focused',
          disabled && 'currency-input__wrapper--disabled'
        )}
      >
        <span className="currency-input__currency">COP</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="currency-input__field"
        />
      </div>
    </div>
  );
}
