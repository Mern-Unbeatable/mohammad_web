import Skeleton from '@/components/loader/Skeleton';

/** Matches My Applications row on MyJobsView */
const ApplicationRowSkeleton = () => (
  <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
    <Skeleton className="w-16 shrink-0 self-stretch" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3.5 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-[68px] shrink-0" rounded="md" />
  </div>
);

export default ApplicationRowSkeleton;
