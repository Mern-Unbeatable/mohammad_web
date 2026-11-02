import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches JobCard layout; `mine` adds the status badge and owner actions. */
const JobCardSkeleton = ({ mine = false }) => (
  <Card className="p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        <Skeleton className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" rounded="xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-xs" />
          <div className="mt-3 flex flex-wrap gap-2">
            {mine ? <Skeleton className="h-5 w-14" rounded="full" /> : null}
            <Skeleton className="h-5 w-16" rounded="full" />
            <Skeleton className="h-5 w-14" rounded="full" />
            <Skeleton className="h-5 w-20" rounded="full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      {mine ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[104px]" />
          <Skeleton className="h-9 w-[78px]" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      ) : (
        <Skeleton className="h-9 w-28 shrink-0" />
      )}
    </div>
  </Card>
);

export default JobCardSkeleton;
