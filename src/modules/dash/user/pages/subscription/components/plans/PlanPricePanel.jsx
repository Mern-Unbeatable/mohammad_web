import { Loader2 } from 'lucide-react';
import { PLAN_PERKS } from '../../constant/constants';

/** Left half of the plan card: price, perks, subscribe and cancel. */
const PlanPricePanel = ({
  plan,
  saving,
  alreadyOnPlan,
  subscribeLabel,
  onSubscribe,
  showCancel,
  onCancel,
}) => (
  <div className="border-b border-[#E4E7EC] p-6 sm:p-8 lg:border-b-0 lg:border-r">
    <span className="inline-flex rounded-md bg-[#E67E22] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
      Lab Unity Membership
    </span>

    <p className="mt-5 text-[36px] font-bold leading-none text-deep-blue sm:text-[42px]">
      {plan.price}
      <span className="text-[18px] font-semibold text-[#64748B]">
        {' '}
        / {plan.period}
      </span>
    </p>
    <p className="mt-3 text-[14px] text-[#64748B]">No long-term commitment. Cancel anytime.</p>

    <ul className="mt-5 space-y-2.5">
      {PLAN_PERKS.map((perk) => (
        <li key={perk.label} className="flex items-center gap-2 text-[12px] text-[#64748B]">
          <perk.Icon className="h-4 w-4 shrink-0 text-primary" />
          {perk.label}
        </li>
      ))}
    </ul>

    <button
      type="button"
      onClick={onSubscribe}
      disabled={saving || alreadyOnPlan}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#066BB0] disabled:opacity-60"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {subscribeLabel}
    </button>

    {showCancel ? (
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="mt-3 w-full rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60"
      >
        Cancel subscription
      </button>
    ) : null}

    <p className="mt-3 text-center text-[12px] text-primary">
      No commitment — Cancel anytime from settings
    </p>
  </div>
);

export default PlanPricePanel;
