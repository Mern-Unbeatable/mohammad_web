import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches ProfileHero card */
const ProfileHeroSkeleton = () => (
  <Card>
    <Skeleton className="h-32 w-full sm:h-36" rounded="none" />
    <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <Skeleton
            className="-mt-[4.25rem] h-24 w-24 shrink-0 border-[3px] border-white sm:-mt-[4.75rem] sm:h-28 sm:w-28"
            rounded="full"
          />
          <div className="min-w-0 flex-1 space-y-2 sm:pb-0.5">
            <Skeleton className="h-7 w-48 sm:h-8 sm:w-56" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-44" />
            <Skeleton className="mt-1 h-5 w-28" rounded="full" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 shrink-0" />
      </div>
    </div>
  </Card>
);

export default ProfileHeroSkeleton;
