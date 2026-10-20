import Skeleton from '@/components/loader/Skeleton';

/** Matches Profile MyReports list rows */
const ReportRowSkeleton = () => (
  <li className="px-5 py-3.5 sm:px-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-14 shrink-0" rounded="full" />
    </div>
  </li>
);

export default ReportRowSkeleton;
