import Skeleton from '@/components/loader/Skeleton';

/** Matches BlogDetailView / SupplierBlogDetailView */
const BlogDetailSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10"
    aria-busy="true"
    aria-live="polite"
  >
    <article className="min-w-0 space-y-4">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-8 w-4/5 sm:h-9" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="aspect-[16/9] w-full" rounded="xl" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </article>
    <aside className="min-w-0">
      <Skeleton className="mb-4 h-3 w-28" />
      <ul className="divide-y divide-[#E4E7EC] rounded-xl border border-[#E4E7EC] bg-white">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="flex gap-3 p-4">
            <Skeleton className="h-16 w-16 shrink-0" rounded="lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  </div>
);

export default BlogDetailSkeleton;
