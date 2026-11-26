import Skeleton from '@/components/loader/common/Skeleton';

/** Matches GuestSignInCard in the public General post sidebar. */
const GuestSignInCardSkeleton = () => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <Skeleton className="h-5 w-20" />
    <div className="mt-2 space-y-2">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
    <div className="mt-4 flex flex-col gap-2">
      <Skeleton className="h-9 w-full" rounded="lg" />
      <Skeleton className="h-9 w-full" rounded="lg" />
    </div>
  </div>
);

export default GuestSignInCardSkeleton;
