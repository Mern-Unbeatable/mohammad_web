import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches JobCard `layout="grid"` (browse variant). */
const JobGridCardSkeleton = () => (
  <Card className="flex h-full flex-col gap-4 p-4 sm:p-5">
    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
      <Skeleton className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" rounded="xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
    <Skeleton className="mt-auto h-9 w-full" />
  </Card>
);

export default JobGridCardSkeleton;
