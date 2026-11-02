import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PRICING_PATH } from '@/shared/constants/subscriptionAccess';

/**
 * Reusable "Subscription Limit Reached" card. Shown anywhere a user hits a
 * subscription-based limit, instead of allowing further usage.
 *
 * Usage counters are optional — pass `max` (and `current`/`unit`) only when the
 * feature actually tracks a numeric quota (e.g. `5/5 listings used`). When no
 * quota exists the card renders as a plan-access lock without inventing limits.
 */
const SubscriptionLimitCard = ({
  title = 'Limit Reached',
  message = "You've reached your current plan's limit. Upgrade your plan to keep using this feature.",
  current,
  max,
  unit = '',
  pricingPath = PRICING_PATH,
  onViewPricing,
  className = '',
}) => {
  const navigate = useNavigate();
  const showUsage = max !== undefined && max !== null && max !== '';
  const handleViewPricing = () =>
    onViewPricing ? onViewPricing() : navigate(pricingPath);

  return (
    <div
      role="region"
      aria-label="Subscription limit reached"
      className={`mx-auto flex w-full max-w-md flex-col items-center rounded-xl border border-[#E4E7EC] bg-white p-6 text-center sm:p-8 ${className}`.trim()}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2]">
        <Lock className="h-7 w-7 text-[#DC2626]" aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-[20px] font-bold text-deep-blue">{title}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#64748B]">{message}</p>

      {showUsage ? (
        <span className="mt-4 inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1 text-[13px] font-semibold text-[#475467]">
          {current ?? max}/{max}
          {unit ? ` ${unit}` : ''} used
        </span>
      ) : null}

      <button
        type="button"
        onClick={handleViewPricing}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#066BB0]"
      >
        View Pricing Plans
      </button>
    </div>
  );
};

export default SubscriptionLimitCard;
