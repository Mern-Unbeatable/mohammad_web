import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';

/** Matches AdminAccountForm */
const AdminAccountFormSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="mt-2 h-3.5 w-64" />
    </div>
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4 border-b border-[#E4E7EC] pb-4">
        <Skeleton className="h-16 w-16" rounded="full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-44" />
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="ml-auto h-9 w-32" />
      </div>
      <div className="mt-8 space-y-4 border-t border-[#E4E7EC] pt-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="ml-auto h-9 w-36" />
      </div>
    </Card>
  </div>
);

export default AdminAccountFormSkeleton;
