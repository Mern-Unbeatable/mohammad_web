import Card from "@/components/ui/Card";
import CancelSubscriptionModal from "@/modules/user/components/subscription/CancelSubscriptionModal";
import { useCancelSubscription } from "../../hooks/useCancelSubscription";
import {
  canCancelSubscription,
  subscriptionRows,
  subscriptionStatusClass,
  subscriptionStatusKey,
  withSubscriptionDefaults,
} from "../../utils/subscription";

/** `manageable` shows the cancel action, which acts on the signed-in account. */
const SubscriptionDetailsCard = ({ subscription, manageable = true, accent = false }) => {
  const details = withSubscriptionDefaults(subscription);
  const statusKey = subscriptionStatusKey(details);
  const canCancel = canCancelSubscription(details);
  const cancel = useCancelSubscription({ canCancel, isTrial: statusKey === "TRIAL" });

  return (
    <Card className="h-full overflow-hidden">
      <div
        className={`flex items-center gap-2 border-b px-5 py-4 sm:px-6 ${
          accent ? "border-primary bg-primary" : "border-[#E4E7EC]"
        }`}
      >
        <span className="text-[16px] text-[#E67E22]">👑</span>
        <h2 className={`text-[16px] font-bold ${accent ? "text-white" : "text-deep-blue"}`}>
          Subscription Details
        </h2>
      </div>

      <dl className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
        {subscriptionRows(details).map(([label, value, isStatus]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-[13px] text-[#64748B]">{label}</dt>
            <dd className="text-right text-[13px] font-semibold text-deep-blue">
              {isStatus ? (
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${subscriptionStatusClass(statusKey)}`}
                >
                  {value}
                </span>
              ) : (
                value || "—"
              )}
            </dd>
          </div>
        ))}
      </dl>

      {manageable ? (
        <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={cancel.open}
            disabled={!canCancel || cancel.saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {details.cancelAtPeriodEnd ? "Cancellation scheduled" : "Cancel Subscription"}
          </button>
        </div>
      ) : null}

      <CancelSubscriptionModal
        open={manageable && cancel.confirmOpen}
        isTrial={statusKey === "TRIAL"}
        saving={cancel.saving}
        onClose={cancel.close}
        onConfirm={cancel.confirm}
      />
    </Card>
  );
};

export default SubscriptionDetailsCard;
