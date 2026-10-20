import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches ProfessionalInfoCard */
const ProfessionalInfoCardSkeleton = () => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-2 px-5 py-5 sm:px-6">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  </Card>
);

export default ProfessionalInfoCardSkeleton;
