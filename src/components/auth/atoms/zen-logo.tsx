import React from 'react';

interface ZenLogoProps {
  /**
   * Tamaño del logo
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Mostrar nombre junto al ícono
   */
  showName?: boolean;
}

/**
 * ZenLogo - Logo minimalista para autenticación
 */
export function ZenLogo({ size = 'md', showName = true }: ZenLogoProps) {
  const sizeMap = {
    sm: {
      icon: 32,
      text: 'var(--text-lg)'
    },
    md: {
      icon: 48,
      text: 'var(--text-2xl)'
    },
    lg: {
      icon: 64,
      text: 'var(--text-3xl)'
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div className="zen-logo">
      {/* Ícono - Círculo con "M" estilizada */}
      <div className="zen-logo__icon">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Círculo exterior */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="var(--zen-moss)"
            strokeWidth="2"
            fill="none"
          />

          {/* "M" minimalista */}
          <path
            d="M14 30V18L18 24L22 18L26 24L30 18V30"
            stroke="var(--zen-moss)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Nombre */}
      {showName && (
        <div className="zen-logo__name">
          <span className="zen-logo__name-text">Mis Finanzas</span>
        </div>
      )}

      <style jsx>{`
        .zen-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          animation: zen-fade-in var(--duration-base) var(--ease-out);
        }

        .zen-logo__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: zen-bounce-in var(--duration-slow) var(--ease-bounce);
        }

        .zen-logo__icon svg {
          transition: transform var(--duration-base) var(--ease-in-out);
        }

        .zen-logo__icon svg:hover {
          transform: scale(1.05);
        }

        .zen-logo__name {
          animation: zen-slide-up var(--duration-base) var(--ease-out);
          animation-delay: 100ms;
          animation-fill-mode: both;
        }

        .zen-logo__name-text {
          font-family: var(--font-display);
          font-size: ${currentSize.text};
          font-weight: var(--font-bold);
          color: var(--zen-stone);
          letter-spacing: -0.02em;
        }

        /* Hover effect en todo el logo */
        .zen-logo:hover .zen-logo__icon svg {
          transform: scale(1.05) rotate(5deg);
        }
      `}</style>
    </div>
  );
}
