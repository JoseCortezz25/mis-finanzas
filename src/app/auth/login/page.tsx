'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/organisms/auth-layout';
import { AtmosphericBackground } from '@/components/auth/molecules/atmospheric-background';
import { ZenInput } from '@/components/auth/atoms/zen-input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validación simple
  const isEmailValid =
    email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="login"
      atmosphericContent={<AtmosphericBackground variant="login" />}
    >
      <div className="login-form">
        {/* Header - Simplificado */}
        <div className="login-form__header">
          <h1 className="login-form__title animate-slide-up delay-100">
            Bienvenido de nuevo
          </h1>
          <p className="login-form__subtitle animate-fade-in delay-200">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="login-form__form">
          {/* Error general */}
          {error && (
            <div className="login-form__error animate-slide-down">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="login-form__error-icon"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="8"
                  fill="#FFF5F5"
                  stroke="#FF7675"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 5v5M9 12v.5"
                  stroke="#FF7675"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="login-form__error-text">{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="animate-slide-up delay-300">
            <ZenInput
              label="Correo electrónico"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              success={isEmailValid && email.length > 0}
            />
          </div>

          {/* Password */}
          <div className="animate-slide-up delay-400">
            <ZenInput
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onIconClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* ¿Olvidaste tu contraseña? */}
          <div className="login-form__forgot animate-fade-in delay-500">
            <Link
              href="/auth/forgot-password"
              className="login-form__forgot-link"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit button */}
          <div className="animate-scale-in delay-600">
            <Button
              type="submit"
              variant="zen"
              size="zen"
              className="w-full"
              disabled={!isFormValid || loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </div>

          {/* Link a registro */}
          <div className="login-form__footer animate-fade-in delay-700">
            <p className="login-form__footer-text">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="login-form__footer-link">
                Crear cuenta
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-form {
          width: 100%;
        }

        /* ============================================
           HEADER - Más compacto
           ============================================ */
        .login-form__header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .login-form__title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: var(--font-bold);
          color: var(--zen-stone);
          margin-bottom: var(--space-2);
          line-height: var(--leading-tight);
          letter-spacing: -0.02em;
        }

        .login-form__subtitle {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
          line-height: var(--leading-normal);
        }

        /* ============================================
           FORMULARIO - Espaciado consistente
           ============================================ */
        .login-form__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Error global - Mejorado */
        .login-form__error {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          padding: var(--space-3);
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          border: 1.5px solid #ffb8b8;
          border-radius: var(--radius-lg);
          font-family: var(--font-body);
          box-shadow: 0 2px 8px rgba(255, 118, 117, 0.1);
        }

        .login-form__error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .login-form__error-text {
          color: #e63946;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          line-height: 1.5;
        }

        /* ¿Olvidaste tu contraseña? */
        .login-form__forgot {
          text-align: right;
          margin-top: calc(var(--space-1) * -1);
        }

        .login-form__forgot-link {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--zen-moss);
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .login-form__forgot-link:hover {
          color: var(--zen-stone);
          text-decoration: underline;
        }

        /* Footer - Más compacto */
        .login-form__footer {
          text-align: center;
          padding-top: var(--space-2);
          border-top: 1px solid var(--zen-sand);
        }

        .login-form__footer-text {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
        }

        .login-form__footer-link {
          color: var(--zen-moss);
          font-weight: var(--font-semibold);
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-out);
          position: relative;
        }

        .login-form__footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--zen-moss);
          transition: width var(--duration-base) var(--ease-out);
        }

        .login-form__footer-link:hover::after {
          width: 100%;
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 767px) {
          .login-form__header {
            margin-bottom: var(--space-6);
          }

          .login-form__title {
            font-size: 1.5rem;
          }

          .login-form__form {
            gap: var(--space-3);
          }
        }
      `}</style>
    </AuthLayout>
  );
}
