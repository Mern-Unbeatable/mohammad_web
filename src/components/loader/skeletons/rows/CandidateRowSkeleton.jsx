import Skeleton from '@/components/loader/common/Skeleton';

/** Matches a row in the job owner's "Applied Candidates" list */
const CandidateRowSkeleton = () => (
  <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
    <Skeleton className="h-9 w-9 shrink-0 self-start" rounded="full" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-[68px] shrink-0" rounded="md" />
  </div>
);

export default CandidateRowSkeleton;
