import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';
import SkeletonText from '@/components/loader/primitives/SkeletonText';

/** Matches ProfessionalInfoCard */
const ProfessionalInfoCardSkeleton = () => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-48" />
    </div>
    <SkeletonText
      className="space-y-2 px-5 py-5 sm:px-6"
      widths={['w-full', 'w-full', 'w-5/6', 'w-4/5']}
    />
  </Card>
);

export default ProfessionalInfoCardSkeleton;
