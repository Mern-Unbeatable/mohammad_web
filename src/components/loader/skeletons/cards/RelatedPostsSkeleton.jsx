import Skeleton from '@/components/loader/common/Skeleton';

/** Matches RelatedPosts on the General post page. */
const RelatedPostsSkeleton = ({ count = 3 }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4" aria-hidden>
    <Skeleton className="h-5 w-32" />
    <ul className="mt-3 space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex gap-3">
          <Skeleton className="h-16 w-20 shrink-0" rounded="lg" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <Skeleton className="h-3.5 w-14" rounded="full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RelatedPostsSkeleton;
