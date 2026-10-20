import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches ListingCard layout */
const ListingCardSkeleton = () => (
  <Card className="flex h-full flex-col">
    <Skeleton className="aspect-[4/3] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  </Card>
);

export default ListingCardSkeleton;
