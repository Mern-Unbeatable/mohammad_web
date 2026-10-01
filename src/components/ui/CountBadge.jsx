/** Red unread counter; renders nothing for zero. */
const CountBadge = ({ count = 0, max = 99, label, className = "" }) => {
  if (!count || count <= 0) return null;
  return (
    <span
      role="status"
      aria-label={label}
      className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-[#CC1016] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white ${className}`}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
};

export default CountBadge;
