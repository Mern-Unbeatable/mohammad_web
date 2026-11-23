import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches GeneralPostCard layout */
const GeneralPostCardSkeleton = () => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="relative aspect-[16/10]">
      <Skeleton className="h-full w-full" rounded="none" />
      <Skeleton className="absolute left-3 top-3 h-5 w-14" rounded="full" />
    </div>
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-2/3" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>
  </Card>
);

export default GeneralPostCardSkeleton;
