import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>

      {/* Profile overview card */}
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>

      {/* General section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>

      {/* Account section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
