import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';
import SkeletonField from '@/components/loader/primitives/SkeletonField';

/** Matches ProfileSetupForm */
const ProfileSetupFormSkeleton = () => (
  <Card aria-busy="true" aria-live="polite">
    <Skeleton className="h-32 w-full sm:h-36" rounded="none" />
    <div className="relative border-b border-[#E4E7EC] px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
        <Skeleton
          className="-mt-[4.25rem] h-[104px] w-[104px] shrink-0 border-[3px] border-white sm:-mt-[4.75rem]"
          rounded="full"
        />
        <div className="min-w-0 flex-1 space-y-2 sm:pb-0.5">
          <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
          <Skeleton className="h-3.5 w-full max-w-md" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
    </div>
    <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SkeletonField labelWidth="w-20" />
        <SkeletonField labelWidth="w-20" />
      </div>
      <SkeletonField labelWidth="w-32" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SkeletonField labelWidth="w-36" />
        <SkeletonField labelWidth="w-16" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SkeletonField labelWidth="w-14" />
        <SkeletonField labelWidth="w-24" />
      </div>
      <SkeletonField labelWidth="w-40" inputClassName="h-28 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  </Card>
);

export default ProfileSetupFormSkeleton;
