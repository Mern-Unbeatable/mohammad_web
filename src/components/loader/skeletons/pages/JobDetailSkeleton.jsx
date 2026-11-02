import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches JobDetailCard layout */
const JobDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-28" />
    <Card>
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]" rounded="xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-b border-[#E4E7EC] pb-5">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
        <div className="mt-6 space-y-2.5">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
    <Skeleton className="h-10 w-48" />
  </div>
);

export default JobDetailSkeleton;
