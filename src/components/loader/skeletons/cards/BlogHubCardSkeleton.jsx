import Skeleton from '@/components/loader/common/Skeleton';

/** Matches LatestHubCard layout */
const BlogHubCardSkeleton = () => (
  <div className="flex h-full w-full gap-3 rounded-xl border border-[#E4E7EC] bg-white p-4 lg:p-5 sm:gap-4">
    <Skeleton className="h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2 py-0.5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="mt-1 h-3 w-36" />
    </div>
  </div>
);

export default BlogHubCardSkeleton;
