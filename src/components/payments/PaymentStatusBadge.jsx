const TONE_CLASS = {
  success: 'bg-green-secondary text-green-primary',
  warning: 'bg-[#FFFAEB] text-[#B54708]',
  danger: 'bg-[#FEF3F2] text-[#D92D20]',
  muted: 'bg-[#F3F4F6] text-[#64748B]',
};

const PaymentStatusBadge = ({ label, tone = 'muted', className = '' }) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
      TONE_CLASS[tone] || TONE_CLASS.muted
    } ${className}`}
  >
    {label}
  </span>
);

export default PaymentStatusBadge;
