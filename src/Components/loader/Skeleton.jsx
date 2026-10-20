/**
 * Primitive pulse block. Compose card skeletons from this — do not duplicate.
 */
const Skeleton = ({ className = '', rounded = 'md' }) => {
  const radius =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'xl'
        ? 'rounded-xl'
        : rounded === 'lg'
          ? 'rounded-lg'
          : rounded === 'none'
            ? 'rounded-none'
            : 'rounded-md';

  return (
    <div
      className={`animate-pulse bg-[#E4E7EC] ${radius} ${className}`}
      aria-hidden
    />
  );
};

export default Skeleton;
