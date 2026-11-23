const STATUS_STYLES = {
  active: 'bg-green-secondary text-green-primary',
  pending: 'bg-[#FEF9E6] text-[#B8860B]',
  expired: 'bg-[#F3F4F6] text-[#64748B]',
  rejected: 'bg-pink-secondary text-pink-light',
  suspend: 'bg-[#F3E8FF] text-[#7C3AED]',
  suspended: 'bg-[#F3E8FF] text-[#7C3AED]',
  'under review': 'bg-secondary text-primary',
  review: 'bg-secondary text-primary',
  resolved: 'bg-green-secondary text-green-primary',
  approved: 'bg-secondary text-primary',
  default: 'bg-[#F3F4F6] text-[#64748B]',
};

const StatusBadge = ({ status, label, className = '' }) => {
  const key = String(status || label || '')
    .trim()
    .toLowerCase();
  const styles = STATUS_STYLES[key] || STATUS_STYLES.default;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles} ${className}`}
    >
      {label || status}
    </span>
  );
};

export default StatusBadge;
