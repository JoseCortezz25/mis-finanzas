'use client';

import React from 'react';

interface PasswordStrengthBarProps {
  /**
   * Contraseña a evaluar
   */
  password: string;

  /**
   * Mostrar requisitos detallados
   */
  showRequirements?: boolean;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  percentage: number;
}

/**
 * Calcula la fortaleza de una contraseña
 */
function calculatePasswordStrength(password: string): StrengthResult {
  let score = 0;

  // Longitud mínima
  if (password.length >= 8) score++;

  // Letra mayúscula
  if (/[A-Z]/.test(password)) score++;

  // Número
  if (/[0-9]/.test(password)) score++;

  // Carácter especial
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
  const colors = [
    'var(--strength-very-weak)',
    'var(--strength-weak)',
    'var(--strength-fair)',
    'var(--strength-good)',
    'var(--strength-strong)'
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
    percentage: (score / 4) * 100
  };
}

/**
 * PasswordStrengthBar - Indicador visual de fortaleza de contraseña
 */
export function PasswordStrengthBar({
  password,
  showRequirements = false
}: PasswordStrengthBarProps) {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  const requirements = [
    {
      label: 'Al menos 8 caracteres',
      met: password.length >= 8
    },
    {
      label: 'Una letra mayúscula',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Un número',
      met: /[0-9]/.test(password)
    },
    {
      label: 'Un carácter especial',
      met: /[^A-Za-z0-9]/.test(password)
    }
  ];

  return (
    <div className="password-strength">
      {/* Barra de progreso */}
      <div className="password-strength__bar-container">
        <div className="password-strength__bar-bg">
          <div
            className="password-strength__bar-fill"
            style={{
              width: `${strength.percentage}%`,
              backgroundColor: strength.color
            }}
          />
        </div>
        <span
          className="password-strength__label"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>

      {/* Requisitos (opcional) */}
      {showRequirements && (
        <div className="password-strength__requirements">
          <p className="password-strength__requirements-title">Requisitos:</p>
          <ul className="password-strength__requirements-list">
            {requirements.map((req, index) => (
              <li
                key={index}
                className={`requirement ${req.met ? 'requirement--met' : ''}`}
              >
                <span className="requirement__icon">
                  {req.met ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill="var(--zen-success)"
                        fillOpacity="0.1"
                      />
                      <path
                        d="M5 8l2 2 4-4"
                        stroke="var(--zen-success)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="var(--zen-slate)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </span>
                <span className="requirement__label">{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .password-strength {
          margin-top: var(--space-2);
          animation: zen-slide-down var(--duration-base) var(--ease-out);
        }

        /* ============================================
           BARRA DE FORTALEZA
           ============================================ */
        .password-strength__bar-container {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .password-strength__bar-bg {
          flex: 1;
          height: 6px;
          background: var(--zen-sand);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .password-strength__bar-fill {
          height: 100%;
          transition: all var(--duration-base) var(--ease-out);
          border-radius: var(--radius-full);
        }

        .password-strength__label {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          min-width: 90px;
          text-align: right;
          transition: color var(--duration-base) var(--ease-out);
        }

        /* ============================================
           REQUISITOS
           ============================================ */
        .password-strength__requirements {
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: var(--zen-sand);
          background: rgba(223, 230, 233, 0.3);
          border-radius: var(--radius-md);
          animation: zen-slide-down var(--duration-base) var(--ease-out);
        }

        .password-strength__requirements-title {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--zen-shadow);
          margin-bottom: var(--space-2);
        }

        .password-strength__requirements-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .requirement {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .requirement__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .requirement__icon svg {
          display: block;
        }

        .requirement__label {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
          transition: color var(--duration-fast) var(--ease-out);
        }

        .requirement--met .requirement__label {
          color: var(--zen-success);
        }

        /* Animación cuando se cumple un requisito */
        .requirement--met .requirement__icon {
          animation: zen-bounce-in var(--duration-base) var(--ease-bounce);
        }
      `}</style>
    </div>
  );
}
