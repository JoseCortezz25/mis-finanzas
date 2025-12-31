import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Mis Finanzas - Gestión Personal de Finanzas',
  description:
    'Aplicación minimalista para gestionar presupuestos, gastos e ingresos personales',
  authors: [{ name: 'josecortezz16' }],
  keywords: [
    'finanzas',
    'presupuesto',
    'gastos',
    'ingresos',
    'ahorro',
    'metas financieras'
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
