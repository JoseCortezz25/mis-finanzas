import { ReactNode } from 'react';
import { PageHeader } from '@/components/organisms/page-header';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  className?: string;
}

/**
 * Page Layout Template
 * Standard layout for all pages with header, optional actions, and content area
 */
export function PageLayout({
  title,
  description,
  actions,
  children,
  isLoading,
  className,
  loadingMessage = 'Cargando...'
}: PageLayoutProps) {
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('container mx-auto space-y-6 px-6 py-6', className)}>
      {actions ? (
        <div className="flex items-start justify-between gap-4">
          <PageHeader title={title} description={description} />
          {actions}
        </div>
      ) : (
        <PageHeader title={title} description={description} />
      )}

      {children}
    </div>
  );
}
