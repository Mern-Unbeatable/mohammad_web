import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches AdminAdvertisementDetailView split layout */
const AdvertisementDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-36" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <Skeleton className="h-11 w-11" rounded="lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="aspect-[16/9] w-full" rounded="xl" />
          <Skeleton className="h-7 w-28" />
        </div>
      </Card>

      <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10" rounded="full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-full" rounded="lg" />
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] px-5 py-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16" rounded="full" />
          </div>
          <div className="space-y-3 px-5 py-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="h-3.5 w-14" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
            <Skeleton className="h-10 w-full" rounded="lg" />
            <Skeleton className="h-10 w-full" rounded="lg" />
            <Skeleton className="h-10 w-full" rounded="lg" />
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default AdvertisementDetailSkeleton;
