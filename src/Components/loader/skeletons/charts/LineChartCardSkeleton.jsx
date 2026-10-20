import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches LineChartCard / BarChartCard */
const LineChartCardSkeleton = ({ chartHeightClass = 'h-[240px]' }) => (
  <Card className="overflow-hidden">
    <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-[120px]" />
    </div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-4 sm:px-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="p-4 sm:p-5">
      <Skeleton className={`w-full ${chartHeightClass}`} rounded="lg" />
    </div>
  </Card>
);

export default LineChartCardSkeleton;
