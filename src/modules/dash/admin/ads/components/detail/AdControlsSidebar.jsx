import Card from "@/components/ui/Card";
import { STATUS_PILL } from "../../constant/constants";
import ErrorBanner from "../common/ErrorBanner";
import AdCreatorCard from "./AdCreatorCard";
import ReviewActions from "./ReviewActions";

const MetaRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="text-[#64748B]">{label}</span>
    <span className="font-semibold text-deep-blue">{value}</span>
  </div>
);

/** Right-rail admin controls: creator, status, stats, dates, and review actions. */
const AdControlsSidebar = ({ ad, busy, onReview, onReject }) => (
  <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
    <AdCreatorCard creator={ad.creator} />

    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <p className="text-[13px] font-semibold text-[#64748B]">Review</p>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            STATUS_PILL[ad.status] || STATUS_PILL.Expired
          }`}
        >
          {ad.status}
        </span>
      </div>

      <div className="space-y-3 px-5 py-4">
        <MetaRow label="Views" value={Number(ad.views || 0).toLocaleString("en-US")} />
        <MetaRow label="Clicks" value={Number(ad.clicks || 0).toLocaleString("en-US")} />
        <MetaRow
          label="Duration"
          value={ad.durationDays ? `${ad.durationDays} days` : "—"}
        />
        <MetaRow label="Start" value={ad.startDate} />
        <MetaRow label="Expiry" value={ad.expiryDate} />
        <MetaRow label="Price" value={ad.price} />
      </div>

      {ad.rejectionReason ? (
        <div className="border-t border-[#E4E7EC] px-5 py-4">
          <ErrorBanner>Rejection reason: {ad.rejectionReason}</ErrorBanner>
        </div>
      ) : null}

      <ReviewActions
        status={ad.status}
        busy={busy}
        onReview={onReview}
        onReject={onReject}
      />
    </Card>
  </aside>
);

export default AdControlsSidebar;
