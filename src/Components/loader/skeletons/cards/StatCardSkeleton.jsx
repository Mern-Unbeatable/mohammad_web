import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches StatCard (+ optional hint line used on supplier dashboard) */
const StatCardSkeleton = ({ showHint = false }) => (
  <Card className="flex h-full flex-col p-4 sm:p-5">
    <Skeleton className="mb-3 h-10 w-10" rounded="lg" />
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="mt-2 h-6 w-16" />
    {showHint ? (
      <div className="mt-auto pt-3">
        <Skeleton className="h-3 w-28" />
      </div>
    ) : null}
  </Card>
);

export default StatCardSkeleton;
