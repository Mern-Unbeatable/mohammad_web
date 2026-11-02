import { AD_STATUS, REVIEW_ACTIONS } from "../../constant/constants";

/** Approve / Mark expired / Reject; the ad's current status and a running review disable a button. */
const ReviewActions = ({ status, busy, onReview, onReject }) => (
  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4 sm:px-6">
    {REVIEW_ACTIONS.map((action) => (
      <button
        key={action.label}
        type="button"
        disabled={busy || status === action.label}
        onClick={() =>
          action.label === AD_STATUS.REJECTED ? onReject() : onReview(action.label)
        }
        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
      >
        <action.icon className="h-4 w-4" />
        {action.text}
      </button>
    ))}
  </div>
);

export default ReviewActions;
