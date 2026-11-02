import LineChartCardSkeleton from '@/components/loader/skeletons/charts/LineChartCardSkeleton';

/** Alias — same shell as LineChartCardSkeleton */
const BarChartCardSkeleton = ({
  chartHeightClass = 'h-[180px]',
  ...props
}) => <LineChartCardSkeleton chartHeightClass={chartHeightClass} {...props} />;

export default BarChartCardSkeleton;
