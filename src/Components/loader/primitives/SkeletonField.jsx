import Skeleton from '@/components/loader/Skeleton';

/** Form field placeholder: label line above an input box. */
const SkeletonField = ({ labelWidth = 'w-20', inputClassName = 'h-10 w-full' }) => (
  <div className="space-y-2">
    <Skeleton className={`h-3.5 ${labelWidth}`} />
    <Skeleton className={inputClassName} />
  </div>
);

export default SkeletonField;
