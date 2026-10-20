import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches AdminSettings multi-card form layout */
const AdminSettingsSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    {Array.from({ length: 3 }, (_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <Skeleton className="h-9 w-9 shrink-0" rounded="lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" rounded="full" />
            <Skeleton className="h-8 w-28" rounded="full" />
            <Skeleton className="h-8 w-20" rounded="full" />
          </div>
          <Skeleton className="ml-auto h-9 w-28" />
        </div>
      </Card>
    ))}
  </div>
);

export default AdminSettingsSkeleton;
