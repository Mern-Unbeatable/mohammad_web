import { getAdManageActions } from "../../utils/adManageActions";

/** Pay / cancel / resubmit / renew / delete — stacked for the status sidebar. */
const AdManageActions = ({ status, busy, onAction }) => {
  const actions = getAdManageActions(status);
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={busy}
          onClick={() => onAction(action.id)}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default AdManageActions;
