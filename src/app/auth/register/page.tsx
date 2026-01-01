'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/organisms/auth-layout';
import { AtmosphericBackground } from '@/components/auth/molecules/atmospheric-background';
import { ZenInput } from '@/components/auth/atoms/zen-input';
import { Button } from '@/components/ui/button';
import { PasswordStrengthBar } from '@/components/auth/molecules/password-strength-bar';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validaciones
  const isEmailValid =
    email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid && passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="register"
      atmosphericContent={<AtmosphericBackground variant="register" />}
    >
      <div className="register-form">
        {/* Success state */}
        {success ? (
          <div className="success-state">
            <div className="success-state__icon animate-bounce-in">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="var(--zen-success)"
                  fillOpacity="0.1"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="var(--zen-success)"
                  strokeWidth="2.5"
                />
                <path
                  d="M20 32l8 8 16-16"
                  stroke="var(--zen-success)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="success-state__title animate-slide-up delay-200">
              ¡Cuenta creada!
            </h2>
            <p className="success-state__message animate-fade-in delay-300">
              Revisa tu correo para confirmar tu cuenta.
            </p>
          </div>
        ) : (
          <>
            {/* Header - Simplificado */}
            <div className="register-form__header">
              <h1 className="register-form__title animate-slide-up delay-100">
                Crea tu cuenta
              </h1>
              <p className="register-form__subtitle animate-fade-in delay-200">
                Comienza a gestionar tus finanzas hoy
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleRegister} className="register-form__form">
              {/* Error general */}
              {error && (
                <div className="register-form__error animate-slide-down">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 4v5M8 11v1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{error}</span>
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onIconClick={() => setShowPassword(!showPassword)}
                />
                {password.length > 0 && (
                  <PasswordStrengthBar password={password} showRequirements />
                )}
              </div>

              {/* Confirm Password */}
              <div className="animate-slide-up delay-500">
                <ZenInput
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm-password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  success={passwordsMatch}
                  error={
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'Las contraseñas no coinciden'
                      : undefined
                  }
                  icon={
                    passwordsMatch ? (
                      <Check size={18} />
                    ) : showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )
                  }
                  onIconClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
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
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </div>

              {/* Términos - Más compacto */}
              <p className="register-form__terms animate-fade-in delay-700">
                Al continuar, aceptas los{' '}
                <Link href="/terms" className="register-form__terms-link">
                  Términos
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="register-form__terms-link">
                  Privacidad
                </Link>
              </p>

              {/* Link a login */}
              <div className="register-form__footer animate-fade-in delay-800">
                <p className="register-form__footer-text">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="/auth/login"
                    className="register-form__footer-link"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        .register-form {
          width: 100%;
        }

        /* ============================================
           HEADER - Más compacto
           ============================================ */
        .register-form__header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .register-form__title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: var(--font-bold);
          color: var(--zen-stone);
          margin-bottom: var(--space-2);
          line-height: var(--leading-tight);
          letter-spacing: -0.02em;
        }

        .register-form__subtitle {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
          line-height: var(--leading-normal);
        }

        /* ============================================
           FORMULARIO - Espaciado consistente
           ============================================ */
        .register-form__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Error global - Más compacto */
        .register-form__error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: rgba(255, 118, 117, 0.08);
          border: 1px solid var(--zen-error);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-error);
          font-weight: var(--font-medium);
        }

        .register-form__error svg {
          flex-shrink: 0;
        }

        /* Términos - Más compacto */
        .register-form__terms {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          color: var(--zen-shadow);
          text-align: center;
          line-height: var(--leading-normal);
        }

        .register-form__terms-link {
          color: var(--zen-moss);
          text-decoration: none;
          font-weight: var(--font-medium);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .register-form__terms-link:hover {
          text-decoration: underline;
        }

        /* Footer - Más compacto */
        .register-form__footer {
          text-align: center;
          padding-top: var(--space-2);
          border-top: 1px solid var(--zen-sand);
        }

        .register-form__footer-text {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
        }

        .register-form__footer-link {
          color: var(--zen-moss);
          font-weight: var(--font-semibold);
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-out);
          position: relative;
        }

        .register-form__footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--zen-moss);
          transition: width var(--duration-base) var(--ease-out);
        }

        .register-form__footer-link:hover::after {
          width: 100%;
        }

        /* ============================================
           SUCCESS STATE - Más compacto
           ============================================ */
        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-8) 0;
        }

        .success-state__icon {
          margin-bottom: var(--space-4);
        }

        .success-state__title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: var(--font-bold);
          color: var(--zen-stone);
          margin-bottom: var(--space-2);
        }

        .success-state__message {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--zen-shadow);
          line-height: var(--leading-relaxed);
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 767px) {
          .register-form__header {
            margin-bottom: var(--space-6);
          }

          .register-form__title {
            font-size: 1.5rem;
          }

          .register-form__form {
            gap: var(--space-3);
          }

          .success-state {
            padding: var(--space-6) 0;
          }

          .success-state__title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </AuthLayout>
  );
}
