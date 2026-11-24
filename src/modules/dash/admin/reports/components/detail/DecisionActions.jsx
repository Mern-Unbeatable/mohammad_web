import { Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import { ACTION_TONES, DECISION_ACTIONS } from "../../constant/constants";

/** Stacked moderation decisions for the report detail sidebar. */
const DecisionActions = ({ disabled, onDecide }) => (
  <Card className="overflow-hidden">
    <div className="flex items-start gap-2 border-b border-[#E4E7EC] px-4 py-3">
      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <h2 className="text-[13px] font-bold text-deep-blue">Moderation actions</h2>
        <p className="mt-0.5 text-[12px] text-[#64748B]">
          Choose a measure based on the evidence.
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-2 bg-[#F9FAFB] px-4 py-3">
      {DECISION_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onDecide(action)}
            disabled={disabled}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${ACTION_TONES[action.tone]}`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            {action.label}
          </button>
        );
      })}
    </div>
  </Card>
);

export default DecisionActions;
