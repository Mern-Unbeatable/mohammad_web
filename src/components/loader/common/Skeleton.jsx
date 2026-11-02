const RADIUS = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const TONE = {
  default: 'bg-[#E4E7EC]',
  muted: 'bg-[#EEF2F6]',
};

/**
 * Primitive pulse block. Compose every skeleton from this — do not duplicate.
 * `rounded`: none | sm | md | lg | xl | full. `tone`: default | muted.
 */
const Skeleton = ({ className = '', rounded = 'md', tone = 'default' }) => (
  <div
    className={`animate-pulse ${TONE[tone] ?? TONE.default} ${RADIUS[rounded] ?? RADIUS.md} ${className}`}
    aria-hidden
  />
);

export default Skeleton;
