import Skeleton from '@/components/loader/Skeleton';

/** Matches BlogGridCard layout */
const BlogGridCardSkeleton = () => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <Skeleton className="aspect-[16/10] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-3/4" />
      <div className="mt-4 flex items-center gap-2.5 border-t border-[#E4E7EC] pt-4">
        <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  </article>
);

export default BlogGridCardSkeleton;
