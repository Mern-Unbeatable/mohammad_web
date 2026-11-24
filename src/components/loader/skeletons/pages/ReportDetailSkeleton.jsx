import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches AdminReportDetailView split layout */
const ReportDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-32" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
        <div className="grid grid-cols-3 gap-3 border-b border-[#E4E7EC] px-5 py-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-2 bg-[#FFF7ED] px-5 py-4">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="space-y-2 px-5 py-5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      </Card>

      <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
        {Array.from({ length: 2 }, (_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9" rounded="full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="mt-3 h-9 w-full" rounded="lg" />
          </Card>
        ))}
        <Card className="overflow-hidden">
          <div className="space-y-2 border-b border-[#E4E7EC] px-4 py-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="space-y-2 bg-[#F9FAFB] px-4 py-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" rounded="lg" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default ReportDetailSkeleton;
