import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches AdminAdvertisementDetailView */
const AdvertisementDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-36" />
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11" rounded="lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" rounded="full" />
      </div>
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="aspect-[16/9] w-full" rounded="xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

export default AdvertisementDetailSkeleton;
