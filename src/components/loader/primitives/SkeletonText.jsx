import Skeleton from '@/components/loader/common/Skeleton';

/**
 * Paragraph placeholder: one line per entry in `widths` (full Tailwind width
 * classes, e.g. `['w-full', 'w-5/6']`), wrapped in a div with `className`.
 */
const SkeletonText = ({ widths, className = '', lineClassName = 'h-3.5' }) => (
  <div className={className || undefined}>
    {widths.map((width, i) => (
      <Skeleton key={i} className={`${lineClassName} ${width}`} />
    ))}
  </div>
);

export default SkeletonText;
