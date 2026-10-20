import Skeleton from '@/components/loader/Skeleton';

/** Matches GeneralPostDetailView layout */
const GeneralPostDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="aspect-[21/9] w-full sm:aspect-[16/7]" rounded="xl" />
    <Skeleton className="h-5 w-16" rounded="full" />
    <Skeleton className="h-8 w-4/5 sm:h-9" />
    <div className="flex flex-wrap gap-4">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3.5 w-24" />
    </div>
    <div className="space-y-3 pt-2">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
    <div className="flex flex-wrap gap-2 pt-2">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export default GeneralPostDetailSkeleton;
