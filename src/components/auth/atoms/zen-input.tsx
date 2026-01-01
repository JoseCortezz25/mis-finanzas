'use client';

import React, { useState, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface ZenInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /**
   * Label del input
   */
  label: string;

  /**
   * Mensaje de error (si existe, muestra estado de error)
   */
  error?: string;

  /**
   * Estado de éxito
   */
  success?: boolean;

  /**
   * Ícono a la derecha del input
   */
  icon?: React.ReactNode;

  /**
   * Callback cuando se hace click en el ícono
   */
  onIconClick?: () => void;
}

/**
 * ZenInput - Input minimalista con label flotante y estados visuales
 */
export function ZenInput({
  label,
  error,
  success,
  icon,
  onIconClick,
  type = 'text',
  value,
  ...props
}: ZenInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const hasValue = value !== undefined && value !== '';
  const showFloatingLabel = isFocused || hasValue;

  // Determinar el estado del input
  const state = error
    ? 'error'
    : success
      ? 'success'
      : isFocused
        ? 'focus'
        : 'normal';

  return (
    <div className="zen-input-wrapper">
      <div className={`zen-input-container ${state}`}>
        {/* Label flotante */}
        <label
          htmlFor={id}
          className={`zen-input-label ${showFloatingLabel ? 'floating' : ''}`}
        >
          {label}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          {...props}
          className="zen-input"
          onFocus={e => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {/* Ícono opcional */}
        {icon && (
          <button
            type="button"
            className="zen-input-icon"
            onClick={onIconClick}
            tabIndex={-1}
            aria-label="Toggle"
          >
            {icon}
          </button>
        )}

        {/* Indicador de éxito */}
        {success && !error && (
          <div className="zen-input-success-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="9"
                fill="var(--zen-success)"
                fillOpacity="0.1"
              />
              <path
                d="M6 10l2.5 2.5L14 7"
                stroke="var(--zen-success)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Border animado */}
        <div className="zen-input-border" />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="zen-input-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="var(--zen-error)"
              strokeWidth="1.5"
            />
            <path
              d="M8 4v5M8 11v1"
              stroke="var(--zen-error)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        .zen-input-wrapper {
          width: 100%;
          margin-bottom: var(--space-3);
        }

        .zen-input-container {
          position: relative;
          width: 100%;
        }

        /* Label */
        .zen-input-label {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-body);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--zen-shadow);
          pointer-events: none;
          transition: all var(--duration-base) var(--ease-out);
          z-index: 1;
        }

        .zen-input-label.floating {
          top: 0;
          transform: translateY(-100%);
          font-size: var(--text-sm);
          color: var(--zen-moss);
          font-weight: var(--font-semibold);
        }

        /* Input */
        .zen-input {
          width: 100%;
          padding: var(--space-3) 0;
          padding-right: ${icon ? 'var(--space-6)' : '0'};
          font-family: var(--font-body);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--zen-stone);
          background: transparent;
          border: none;
          outline: none;
          position: relative;
          z-index: 2;
        }

        .zen-input::placeholder {
          color: var(--zen-slate);
          opacity: 0;
          transition: opacity var(--duration-fast) var(--ease-out);
        }

        .zen-input:focus::placeholder {
          opacity: 1;
        }

        /* Border inferior animado */
        .zen-input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--zen-slate);
          transition: all var(--duration-base) var(--ease-out);
        }

        .zen-input-border::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--zen-moss);
          transition: width var(--duration-base) var(--ease-out);
        }

        /* Estados */
        .zen-input-container.focus .zen-input-border::after {
          width: 100%;
        }

        .zen-input-container.error .zen-input-border {
          background: var(--zen-error);
        }

        .zen-input-container.error .zen-input-border::after {
          width: 100%;
          background: var(--zen-error);
        }

        .zen-input-container.error .zen-input-label.floating {
          color: var(--zen-error);
        }

        .zen-input-container.success .zen-input-border::after {
          width: 100%;
          background: var(--zen-success);
        }

        /* Ícono */
        .zen-input-icon {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--zen-shadow);
          cursor: pointer;
          padding: var(--space-1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-out);
          z-index: 3;
        }

        .zen-input-icon:hover {
          color: var(--zen-moss);
          transform: translateY(-50%) scale(1.1);
        }

        /* Ícono de éxito */
        .zen-input-success-icon {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: zen-scale-in var(--duration-base) var(--ease-out);
          z-index: 3;
        }

        /* Mensaje de error */
        .zen-input-error {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-top: var(--space-1);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-error);
          animation: zen-slide-down var(--duration-base) var(--ease-out);
        }

        .zen-input-error svg {
          flex-shrink: 0;
        }

        /* Animación de shake para error */
        .zen-input-container.error {
          animation: zen-shake var(--duration-slow) var(--ease-in-out);
        }

        /* Estados disabled */
        .zen-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .zen-input:disabled ~ .zen-input-border {
          background: var(--zen-slate);
        }

        /* Autocomplete styling */
        .zen-input:-webkit-autofill,
        .zen-input:-webkit-autofill:hover,
        .zen-input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--zen-stone);
          -webkit-box-shadow: 0 0 0 1000px var(--zen-mist) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
