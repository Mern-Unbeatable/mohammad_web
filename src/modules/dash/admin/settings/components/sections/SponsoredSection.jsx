import { Calculator } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  panelPageTheme,
  panelPrimaryBtn,
} from "@/components/navigation/panel/panelPageTheme";
import { Input } from "@/components/form-controls";
import SectionHeader from "../common/SectionHeader";
import PriceField from "../common/PriceField";
import { saveLabel } from "../../utils/settingsForm";

/** One row per sponsored tier (read-only day label + price); every Save sends all tiers. */
const SponsoredSection = ({ sponsored }) => (
  <Card className="overflow-hidden">
    <SectionHeader
      icon={Calculator}
      iconClass="bg-[#FEF3E8] text-[#E67E22]"
      title="Sponsored Post Pricing"
      subtitle="Manage Sponsored post pricing."
    />

    <div className="space-y-3 px-4 py-4 sm:px-5">
      {sponsored.tiers.map((tier) => (
        <div
          key={tier.id}
          className="flex flex-col gap-3 border-b border-[#F4F5F7] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-end"
        >
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}>Day</label>
              <Input variant="settings" type="text" value={tier.label} readOnly />
            </div>
            <PriceField
              id={`price-${tier.id}`}
              label="Price"
              value={tier.price}
              onChange={(price) => sponsored.setTierPrice(tier.id, price)}
            />
          </div>
          <button
            type="button"
            disabled={sponsored.saving}
            onClick={sponsored.save}
            className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0 disabled:opacity-60`}
          >
            {saveLabel(sponsored.saving)}
          </button>
        </div>
      ))}
    </div>
  </Card>
);

export default SponsoredSection;
