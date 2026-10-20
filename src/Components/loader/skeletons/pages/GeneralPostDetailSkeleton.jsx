import Skeleton from '@/components/loader/common/Skeleton';
import SkeletonText from '@/components/loader/primitives/SkeletonText';

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
    <SkeletonText
      className="space-y-3 pt-2"
      widths={['w-full', 'w-full', 'w-full', 'w-5/6', 'w-4/5']}
    />
    <div className="flex flex-wrap gap-2 pt-2">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export default GeneralPostDetailSkeleton;
