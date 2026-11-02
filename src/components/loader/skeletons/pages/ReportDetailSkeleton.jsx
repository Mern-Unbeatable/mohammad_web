import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches AdminReportDetailView */
const ReportDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-32" />
    <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-4/5" />
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }, (_, i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12" rounded="full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
    <Card className="p-5">
      <Skeleton className="h-4 w-28" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
    </Card>
  </div>
);

export default ReportDetailSkeleton;
