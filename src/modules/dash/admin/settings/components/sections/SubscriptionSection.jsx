import { Check, Wallet } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  panelPageTheme,
  panelPrimaryBtn,
} from "@/components/navigation/panel/panelPageTheme";
import { SUBSCRIPTION_FEATURES } from "@/features/dash/admin/settings";
import SectionHeader from "../common/SectionHeader";
import PriceField from "../common/PriceField";
import { saveLabel } from "../../utils/settingsForm";

/** Monthly / yearly prices with Save, and the included-features list. */
const SubscriptionSection = ({ subscription }) => (
  <Card className="overflow-hidden">
    <SectionHeader
      icon={Wallet}
      iconClass="bg-secondary text-primary"
      title="Manage Your Subscription"
      subtitle="Edit and Delete your subscription package."
    />

    <div className="space-y-4 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <PriceField
            id="monthly-price"
            label="Monthly"
            value={subscription.monthly}
            onChange={subscription.setMonthly}
          />
          <PriceField
            id="yearly-price"
            label="Yearly"
            value={subscription.yearly}
            onChange={subscription.setYearly}
          />
        </div>
        <button
          type="button"
          disabled={subscription.saving}
          onClick={subscription.save}
          className={`${panelPrimaryBtn} w-full lg:w-auto lg:shrink-0 disabled:opacity-60`}
        >
          {saveLabel(subscription.saving)}
        </button>
      </div>

      <div className="rounded-xl border border-secondary bg-secondary/30 p-3.5 sm:p-4">
        <p className={`mb-2.5 ${panelPageTheme.cardEyebrow}`}>Everything included</p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {SUBSCRIPTION_FEATURES.map((feature) => (
            <li key={feature} className={`flex items-start gap-2 ${panelPageTheme.cardBody}`}>
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-primary" strokeWidth={2.5} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
);

export default SubscriptionSection;
