import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';
import ReportRowSkeleton from '@/components/loader/skeletons/rows/ReportRowSkeleton';

/** Matches MyReportsCard shell + rows */
const MyReportsCardSkeleton = () => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-2 h-3 w-56" />
    </div>
    <ul className="divide-y divide-[#E4E7EC]">
      {Array.from({ length: 3 }, (_, i) => (
        <ReportRowSkeleton key={i} />
      ))}
    </ul>
  </Card>
);

export default MyReportsCardSkeleton;
