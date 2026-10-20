import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches SubscriptionDetailsCard */
const SubscriptionDetailsCardSkeleton = () => (
  <Card className="h-full">
    <div className="flex items-center gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-3.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton
            className={`h-3.5 ${i === 1 ? 'w-16' : 'w-28'}`}
            rounded={i === 1 ? 'full' : 'md'}
          />
        </div>
      ))}
    </div>
    <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export default SubscriptionDetailsCardSkeleton;
