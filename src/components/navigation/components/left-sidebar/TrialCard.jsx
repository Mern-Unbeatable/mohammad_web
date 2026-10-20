import { Clock, Crown, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  expiredOrUpgradeText,
  sidebarMembershipCard,
  trialProgress,
} from "../../utils/membership";
import ViewPlansLink from "../membership/ViewPlansLink";

const TrialCard = ({ user }) => {
  const card = sidebarMembershipCard(user);

  if (card === "trial") {
    const { total, left, remainingPercent } = trialProgress(user);

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
            <Sparkles aria-hidden className="h-4 w-4 text-[#B8860B]" />
            Free trial
          </p>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#64748B]">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {left} of {total} days remaining
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${remainingPercent}%` }}
          />
        </div>
        <ViewPlansLink />
      </Card>
    );
  }

  if (card === "upgrade") {
    return (
      <Card className="p-4">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
          <Crown aria-hidden className="h-4 w-4 text-[#E67E22]" />
          Membership
        </p>
        <p className="mt-1 text-[12px] text-red-500">
          {expiredOrUpgradeText(user.membershipStatus)}
        </p>
        <ViewPlansLink />
      </Card>
    );
  }

  return null;
};

export default TrialCard;
