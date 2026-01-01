import React from 'react';

interface AtmosphericBackgroundProps {
  /**
   * Variante: login (frío) o register (cálido)
   */
  variant?: 'login' | 'register';
}

/**
 * AtmosphericBackground - Background decorativo para auth pages
 */
export function AtmosphericBackground({
  variant = 'login'
}: AtmosphericBackgroundProps) {
  const content = {
    login: {
      title: 'Control.',
      subtitle: 'Claridad.',
      line3: 'Crecimiento.',
      quote: 'Tu futuro financiero comienza aquí'
    },
    register: {
      title: 'Cada gran',
      subtitle: 'viaje comienza',
      line3: 'con un solo paso.',
      quote: 'Construye el hábito del éxito'
    }
  };

  const current = content[variant];

  return (
    <div className="atmospheric-bg">
      {/* Patrón de fondo */}
      <div className="atmospheric-bg__pattern" />

      {/* Formas abstractas flotantes */}
      <div className="atmospheric-bg__shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>

      {/* Contenido textual */}
      <div className="atmospheric-bg__content">
        <h1 className="atmospheric-bg__title">
          <span className="line animate-slide-up delay-100">
            {current.title}
          </span>
          <span className="line animate-slide-up delay-200">
            {current.subtitle}
          </span>
          <span className="line animate-slide-up delay-300">
            {current.line3}
          </span>
        </h1>

        <p className="atmospheric-bg__quote animate-fade-in delay-400">
          {current.quote}
        </p>
      </div>

      {/* Decoración inferior */}
      <div className="atmospheric-bg__decoration" />

      <style jsx>{`
        .atmospheric-bg {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          overflow: hidden;
        }

        /* ============================================
           PATRÓN DE FONDO - Grid sutil
           ============================================ */
        .atmospheric-bg__pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          background-image:
            repeating-linear-gradient(
              0deg,
              var(--zen-stone) 0px,
              var(--zen-stone) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              90deg,
              var(--zen-stone) 0px,
              var(--zen-stone) 1px,
              transparent 1px,
              transparent 40px
            );
        }

        /* ============================================
           FORMAS ABSTRACTAS
           ============================================ */
        .atmospheric-bg__shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
          filter: blur(80px);
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          top: 10%;
          left: 10%;
          background: ${variant === 'login'
            ? 'var(--zen-moss)'
            : 'var(--zen-clay)'};
          animation: zen-float 20s ease-in-out infinite;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          top: 60%;
          right: 10%;
          background: ${variant === 'login'
            ? 'var(--zen-sand)'
            : 'var(--zen-clay-light)'};
          animation: zen-float 15s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 30%;
          background: ${variant === 'login'
            ? 'var(--zen-slate)'
            : 'var(--zen-clay)'};
          animation: zen-float 18s ease-in-out infinite;
        }

        .shape-4 {
          width: 350px;
          height: 350px;
          top: 40%;
          right: 30%;
          background: ${variant === 'login'
            ? 'var(--zen-moss)'
            : 'var(--zen-clay-dark)'};
          animation: zen-float 22s ease-in-out infinite reverse;
        }

        @keyframes zen-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        /* ============================================
           CONTENIDO TEXTUAL
           ============================================ */
        .atmospheric-bg__content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 600px;
        }

        .atmospheric-bg__title {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .atmospheric-bg__title .line {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: var(--font-bold);
          color: var(--zen-stone);
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .atmospheric-bg__quote {
          font-family: var(--font-body);
          font-size: var(--text-lg);
          font-weight: var(--font-medium);
          color: var(--zen-shadow);
          line-height: var(--leading-relaxed);
          max-width: 400px;
          margin: 0 auto;
        }

        /* ============================================
           DECORACIÓN INFERIOR
           ============================================ */
        .atmospheric-bg__decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 150px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.02) 0%,
            transparent 100%
          );
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 1023px) {
          .atmospheric-bg {
            padding: var(--space-4);
          }

          .atmospheric-bg__title .line {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
          }

          .atmospheric-bg__quote {
            font-size: var(--text-base);
          }

          .shape {
            filter: blur(60px);
          }
        }

        @media (max-width: 767px) {
          .atmospheric-bg {
            padding: var(--space-3);
            justify-content: flex-start;
            padding-top: var(--space-6);
          }

          .atmospheric-bg__content {
            max-width: 100%;
          }

          .atmospheric-bg__quote {
            display: none;
          }

          .shape {
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
}
