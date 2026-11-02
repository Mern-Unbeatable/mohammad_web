import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches ListingDetailView layout */
const ListingDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-40" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
      <div className="min-w-0 space-y-5">
        <div>
          <Skeleton className="aspect-[16/10] w-full" rounded="xl" />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" rounded="xl" />
            ))}
          </div>
        </div>
        <Card>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-16" rounded="full" />
              <Skeleton className="h-5 w-20" rounded="full" />
              <Skeleton className="h-5 w-24" rounded="full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card className="p-5 sm:p-6">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-2 h-3 w-40" />
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="mt-5 h-3 w-44" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-full" />
        </Card>
      </aside>
    </div>
  </div>
);

export default ListingDetailSkeleton;
