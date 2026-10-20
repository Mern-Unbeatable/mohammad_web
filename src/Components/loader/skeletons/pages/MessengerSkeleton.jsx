import Skeleton from '@/components/loader/Skeleton';

/** Matches Messenger two-panel shell */
const MessengerSkeleton = () => (
  <div
    className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white xl:grid xl:grid-cols-[340px_minmax(0,1fr)]"
    style={{ height: '620px' }}
    aria-busy="true"
    aria-live="polite"
  >
    <aside className="flex min-h-0 flex-col border-[#E4E7EC] xl:border-r">
      <div className="space-y-3 border-b border-[#E4E7EC] p-4">
        <Skeleton className="h-9 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" rounded="full" />
          <Skeleton className="h-8 flex-1" rounded="full" />
        </div>
      </div>
      <ul className="divide-y divide-[#E4E7EC]">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </li>
        ))}
      </ul>
    </aside>
    <div className="hidden flex-col xl:flex">
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <Skeleton className="h-10 w-10" rounded="full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex-1 space-y-3 p-5">
        <Skeleton className="ml-auto h-10 w-2/5" rounded="lg" />
        <Skeleton className="h-10 w-1/2" rounded="lg" />
        <Skeleton className="ml-auto h-10 w-1/3" rounded="lg" />
        <Skeleton className="h-10 w-2/5" rounded="lg" />
      </div>
      <div className="border-t border-[#E4E7EC] p-4">
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  </div>
);

export default MessengerSkeleton;
