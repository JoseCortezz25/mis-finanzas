import React from 'react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  /**
   * Contenido del formulario (derecha en desktop, completo en mobile)
   */
  children: ReactNode;

  /**
   * Contenido del background atmosférico (izquierda en desktop, oculto/mini en mobile)
   */
  atmosphericContent: ReactNode;

  /**
   * Variante de estilo: login (tonos fríos) o register (tonos cálidos)
   */
  variant?: 'login' | 'register';
}

/**
 * AuthLayout - Layout base para páginas de autenticación
 *
 * Desktop: 50% background atmosférico | 50% formulario
 * Mobile: Single column con mini header decorativo
 */
export function AuthLayout({
  children,
  atmosphericContent,
  variant = 'login'
}: AuthLayoutProps) {
  return (
    <div className="auth-layout" data-variant={variant}>
      {/* Background atmosférico - Desktop */}
      <div className="auth-layout__atmospheric">{atmosphericContent}</div>

      {/* Formulario */}
      <div className="auth-layout__form">
        <div className="auth-layout__form-content">{children}</div>
      </div>

      <style jsx>{`
        .auth-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        /* Background atmosférico */
        .auth-layout__atmospheric {
          display: none;
          position: relative;
          overflow: hidden;
        }

        /* Contenedor del formulario */
        .auth-layout__form {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          background: var(--zen-mist);
          position: relative;
        }

        /* Contenido del formulario */
        .auth-layout__form-content {
          width: 100%;
          max-width: 480px;
          animation: zen-slide-up var(--duration-base) var(--ease-out);
        }

        /* ============================================
           DESKTOP (1024px+): Layout 50/50
           ============================================ */
        @media (min-width: 1024px) {
          .auth-layout__atmospheric {
            display: block;
            flex: 1;
            min-height: 100vh;
          }

          /* Login variant - Tonos fríos */
          .auth-layout[data-variant='login'] .auth-layout__atmospheric {
            background: var(--gradient-zen);
          }

          /* Register variant - Tonos cálidos */
          .auth-layout[data-variant='register'] .auth-layout__atmospheric {
            background: var(--gradient-register-bg);
          }

          .auth-layout__form {
            flex: 1;
            padding: var(--space-8);
          }

          .auth-layout__form-content {
            max-width: 520px;
          }
        }

        /* ============================================
           TABLET (768px - 1023px): Single column espacioso
           ============================================ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .auth-layout__atmospheric {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            opacity: 0.3;
            pointer-events: none;
          }

          .auth-layout[data-variant='login'] .auth-layout__atmospheric {
            background: var(--gradient-zen);
          }

          .auth-layout[data-variant='register'] .auth-layout__atmospheric {
            background: var(--gradient-register-bg);
          }

          .auth-layout__form {
            padding: var(--space-6);
            padding-top: var(--space-12);
          }

          .auth-layout__form-content {
            max-width: 500px;
          }
        }

        /* ============================================
           MOBILE (< 768px): Mini decoración
           ============================================ */
        @media (max-width: 767px) {
          .auth-layout__form {
            padding: var(--space-3);
            padding-top: var(--space-8);
          }

          .auth-layout__form-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
