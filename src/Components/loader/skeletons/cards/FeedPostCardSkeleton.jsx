import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';
import SkeletonText from '@/components/loader/primitives/SkeletonText';

/** Matches FeedPost card layout */
const FeedPostCardSkeleton = () => (
  <Card>
    <div className="flex items-start gap-3 p-4 pb-3">
      <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-5 shrink-0" rounded="full" />
    </div>
    <SkeletonText className="space-y-2 px-4 pb-3" widths={['w-full', 'w-full', 'w-3/4']} />
    <Skeleton className="mx-4 mb-3 aspect-[16/9] w-[calc(100%-2rem)]" rounded="lg" />
    <div className="flex items-center justify-between border-t border-[#E4E7EC] px-4 py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex gap-2 border-t border-[#E4E7EC] px-4 py-2.5">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </Card>
);

export default FeedPostCardSkeleton;
