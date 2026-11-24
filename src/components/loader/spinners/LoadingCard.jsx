import { Loader2 } from 'lucide-react';

/** White card with a spinner and a label, e.g. while a form's data loads. */
const LoadingCard = ({ label = 'Loading…', className = 'h-64' }) => (
  <div
    className={`flex items-center justify-center rounded-xl bg-white shadow-sm ${className}`}
    role="status"
  >
    <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" aria-hidden />
    <span className="text-[14px] font-medium text-[#64748B]">{label}</span>
  </div>
);

export default LoadingCard;
