import Skeleton from '@/components/loader/common/Skeleton';

/** Matches JobPosterCard ("Posted by") */
const JobPosterCardSkeleton = () => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <Skeleton className="h-5 w-24" />
    <div className="mt-3 flex items-start gap-3">
      <Skeleton className="h-11 w-11 shrink-0" rounded="full" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-44" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="mt-4 h-9 w-full" rounded="lg" />
  </div>
);

export default JobPosterCardSkeleton;
