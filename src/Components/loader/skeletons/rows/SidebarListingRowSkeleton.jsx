import Skeleton from '@/components/loader/common/Skeleton';

/** Matches RightSidebar marketplace row */
const SidebarListingRowSkeleton = () => (
  <li className="flex items-start gap-3 px-4 py-3">
    <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
    <div className="min-w-0 flex-1">
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="mt-1.5 h-3 w-2/3" />
      <Skeleton className="mt-2 h-3.5 w-16" />
    </div>
  </li>
);

export default SidebarListingRowSkeleton;
