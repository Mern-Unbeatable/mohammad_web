import { Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import { ACTION_TONES, DECISION_ACTIONS } from "../../constant/constants";

/** The five moderation decision tiles; `onDecide` receives the action definition. */
const DecisionActions = ({ disabled, onDecide }) => (
  <Card className="p-5 sm:p-6">
    <div className="mb-4 flex items-center gap-2">
      <Shield className="h-5 w-5 text-primary" />
      <div>
        <h2 className="text-[15px] font-bold text-deep-blue">Admin moderation decision actions</h2>
        <p className="text-[12px] text-[#64748B]">Choose appropriate measure based on evidence.</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {DECISION_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onDecide(action)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${ACTION_TONES[action.tone]}`}
          >
            <Icon className="h-6 w-6" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold leading-snug">{action.label}</span>
          </button>
        );
      })}
    </div>
  </Card>
);

export default DecisionActions;
