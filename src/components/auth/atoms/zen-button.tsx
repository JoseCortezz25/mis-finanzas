'use client';

import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ZenButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * Variante del botón
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Tamaño del botón
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Estado de carga
   */
  loading?: boolean;

  /**
   * Ancho completo
   */
  fullWidth?: boolean;

  /**
   * Ícono a la derecha del texto
   */
  icon?: React.ReactNode;
}

/**
 * ZenButton - Botón minimalista con variantes y estados
 */
export function ZenButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  ...props
}: ZenButtonProps) {
  const sizeClasses = {
    sm: 'zen-button--sm',
    md: 'zen-button--md',
    lg: 'zen-button--lg'
  };

  const variantClass = `zen-button--${variant}`;
  const sizeClass = sizeClasses[size];

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`zen-button ${variantClass} ${sizeClass} ${fullWidth ? 'zen-button--full' : ''} ${loading ? 'zen-button--loading' : ''}`}
    >
      {loading ? (
        <span className="zen-button__spinner">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="40"
            />
          </svg>
        </span>
      ) : null}

      <span
        className={`zen-button__content ${loading ? 'zen-button__content--loading' : ''}`}
      >
        {children}
        {icon && <span className="zen-button__icon">{icon}</span>}
      </span>

      <style jsx>{`
        /* Base */
        .zen-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-family: var(--font-body);
          font-weight: var(--font-semibold);
          border: none;
          cursor: pointer;
          transition: all var(--duration-base) var(--ease-in-out);
          overflow: hidden;
          user-select: none;
        }

        .zen-button__content {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          transition: all var(--duration-base) var(--ease-in-out);
        }

        .zen-button__content--loading {
          opacity: 0;
        }

        .zen-button__icon {
          display: flex;
          align-items: center;
          transition: transform var(--duration-base) var(--ease-in-out);
        }

        /* Spinner de carga */
        .zen-button__spinner {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          animation: zen-spin 0.8s linear infinite;
        }

        @keyframes zen-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Tamaños */
        .zen-button--sm {
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          border-radius: var(--radius-md);
        }

        .zen-button--md {
          padding: var(--space-3) var(--space-6);
          font-size: var(--text-base);
          border-radius: var(--radius-lg);
        }

        .zen-button--lg {
          padding: var(--space-4) var(--space-8);
          font-size: var(--text-lg);
          border-radius: var(--radius-lg);
        }

        /* Full width */
        .zen-button--full {
          width: 100%;
        }

        /* ============================================
           VARIANTE: PRIMARY
           ============================================ */
        .zen-button--primary {
          background: var(--gradient-moss);
          color: var(--zen-white);
          box-shadow: var(--shadow-md);
        }

        .zen-button--primary:hover:not(:disabled) {
          background: var(--gradient-moss-hover);
          box-shadow: var(--shadow-lg);
          transform: translateY(-1px);
        }

        .zen-button--primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        .zen-button--primary:focus-visible {
          box-shadow: var(--shadow-focus);
        }

        /* ============================================
           VARIANTE: SECONDARY
           ============================================ */
        .zen-button--secondary {
          background: transparent;
          color: var(--zen-moss);
          border: 2px solid var(--zen-moss);
        }

        .zen-button--secondary:hover:not(:disabled) {
          background: var(--zen-moss);
          color: var(--zen-white);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .zen-button--secondary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        .zen-button--secondary:focus-visible {
          box-shadow: var(--shadow-focus);
        }

        /* ============================================
           VARIANTE: GHOST
           ============================================ */
        .zen-button--ghost {
          background: transparent;
          color: var(--zen-moss);
          padding: var(--space-2) var(--space-3);
        }

        .zen-button--ghost:hover:not(:disabled) {
          background: rgba(0, 184, 148, 0.1);
        }

        .zen-button--ghost:hover:not(:disabled) .zen-button__icon {
          transform: translateX(4px);
        }

        .zen-button--ghost:active:not(:disabled) {
          background: rgba(0, 184, 148, 0.15);
        }

        /* ============================================
           ESTADO: DISABLED
           ============================================ */
        .zen-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        /* ============================================
           ESTADO: LOADING
           ============================================ */
        .zen-button--loading {
          cursor: wait;
        }

        /* Animación de hover en ícono */
        .zen-button:not(.zen-button--ghost):hover:not(:disabled)
          .zen-button__icon {
          transform: translateX(2px);
        }
      `}</style>
    </button>
  );
}
