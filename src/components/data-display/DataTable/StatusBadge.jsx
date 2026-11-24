const STATUS_STYLES = {
  active: 'bg-green-secondary text-green-primary',
  pending: 'bg-[#FEF9E6] text-[#B8860B]',
  'pending payment': 'bg-[#FFFAEB] text-[#B54708]',
  pending_payment: 'bg-[#FFFAEB] text-[#B54708]',
  expired: 'bg-[#FEF3F2] text-[#D92D20]',
  rejected: 'bg-pink-secondary text-pink-light',
  cancelled: 'bg-[#F3F4F6] text-[#475467]',
  canceled: 'bg-[#F3F4F6] text-[#475467]',
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
