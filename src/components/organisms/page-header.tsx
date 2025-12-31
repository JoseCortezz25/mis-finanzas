interface PageHeaderProps {
  title: string;
  description?: string;
}

/**
 * Page Header Organism
 * Simple component for page headers with title and description
 */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}
