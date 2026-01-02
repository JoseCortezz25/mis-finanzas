'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ProfileErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ProfileErrorProps) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Profile page error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16">
      <Card className="w-full border-red-200/60 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">
            Error al cargar el perfil
          </CardTitle>
          <CardDescription className="text-base">
            No pudimos cargar tu información de perfil. Por favor, intenta
            nuevamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Detalles del error:
              </p>
              <p className="mt-1 font-mono text-sm text-red-700">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} className="flex-1 gap-2" variant="default">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
            <Button asChild variant="outline" className="flex-1 gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
