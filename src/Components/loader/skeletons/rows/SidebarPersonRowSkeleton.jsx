import Skeleton from '@/components/loader/Skeleton';

/** Matches RightSidebar “People you may know” row */
const SidebarPersonRowSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
    <div className="min-w-0 flex-1 space-y-1.5">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-8 w-[76px] shrink-0" />
  </li>
);

export default SidebarPersonRowSkeleton;
