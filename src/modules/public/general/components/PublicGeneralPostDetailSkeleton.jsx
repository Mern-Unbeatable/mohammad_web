import Skeleton from '@/components/loader/common/Skeleton';
import SkeletonText from '@/components/loader/primitives/SkeletonText';
import JobPosterCardSkeleton from '@/components/loader/skeletons/cards/JobPosterCardSkeleton';
import GuestSignInCardSkeleton from './GuestSignInCardSkeleton';

/** Loading layout for the public General post detail page, including the sign-in card. */
const PublicGeneralPostDetailSkeleton = ({ showSignInCard = true }) => (
  <div aria-busy="true" aria-live="polite">
    <div className="mb-5 flex items-center gap-2.5">
      <Skeleton className="h-8 w-8" rounded="full" />
      <Skeleton className="h-4 w-28" />
    </div>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
      <div className="min-w-0 rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-7">
        <Skeleton className="aspect-[21/9] w-full rounded-2xl sm:aspect-[16/7]" rounded="none" />
        <Skeleton className="mt-5 h-5 w-16" rounded="full" />
        <Skeleton className="mt-3 h-8 w-4/5 sm:h-9" />
        <div className="mt-3 flex flex-wrap gap-4">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <SkeletonText
          className="mt-6 space-y-3"
          widths={['w-full', 'w-full', 'w-full', 'w-5/6', 'w-4/5']}
        />
        <div className="mt-8 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="space-y-4">
        <JobPosterCardSkeleton />
        {showSignInCard ? <GuestSignInCardSkeleton /> : null}
      </div>
    </div>
  </div>
);

export default PublicGeneralPostDetailSkeleton;
