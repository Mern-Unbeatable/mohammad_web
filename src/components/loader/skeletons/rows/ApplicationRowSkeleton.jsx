import Skeleton from '@/components/loader/common/Skeleton';

/** Matches My Applications row on MyJobsView */
const ApplicationRowSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-[#E4E7EC] bg-white p-3 sm:flex-row sm:items-center sm:px-4">
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Skeleton className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" rounded="lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 max-w-48" />
        <Skeleton className="h-3.5 w-1/2 max-w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
    <div className="flex gap-2 border-t border-[#F2F4F7] pt-3 sm:shrink-0 sm:border-0 sm:pt-0">
      <Skeleton className="h-8 flex-1 sm:w-[68px] sm:flex-none" rounded="md" />
      <Skeleton className="h-8 flex-1 sm:w-[80px] sm:flex-none" rounded="md" />
    </div>
  </div>
);

export default ApplicationRowSkeleton;
