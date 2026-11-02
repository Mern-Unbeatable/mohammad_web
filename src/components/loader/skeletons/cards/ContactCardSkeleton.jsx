import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches ContactCard layout (Avatar size="lg" = h-14) */
const ContactCardSkeleton = () => (
  <Card className="flex flex-col text-center">
    <Skeleton className="h-16 w-full" rounded="none" />
    <div className="flex flex-col items-center px-5 pb-5">
      <Skeleton
        className="-mt-10 h-20 w-20 border-4 border-white"
        rounded="full"
      />
      <Skeleton className="mt-3 h-4 w-28" />
      <Skeleton className="mt-2 h-3 w-36" />
      <Skeleton className="mt-1.5 h-3.5 w-24" />
      <Skeleton className="mt-1 h-3 w-20" />
      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full" rounded="md" />
        <Skeleton className="h-9 w-full" rounded="md" />
      </div>
    </div>
  </Card>
);

export default ContactCardSkeleton;
