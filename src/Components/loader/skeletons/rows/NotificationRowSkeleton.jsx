import Skeleton from '@/components/loader/Skeleton';

/** Matches notification list row (user notifications NotificationItem) */
const NotificationRowSkeleton = () => (
  <li className="flex w-full items-start gap-4 px-5 py-4 sm:px-6">
    <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-2/3 max-w-xs" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="mt-1 h-3 w-20" />
    </div>
    <Skeleton className="mt-2 h-2.5 w-2.5 shrink-0" rounded="full" />
  </li>
);

export default NotificationRowSkeleton;
