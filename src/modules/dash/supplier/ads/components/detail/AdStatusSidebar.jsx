import {
  CalendarClock,
  CalendarDays,
  Eye,
  MousePointerClick,
  Timer,
  Wallet,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { STATUS_PILL } from "../../constant/constants";
import ErrorBanner from "../common/ErrorBanner";
import AdManageActions from "./AdManageActions";

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="inline-flex items-center gap-2 text-[#64748B]">
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
      {label}
    </span>
    <span className="font-semibold text-deep-blue">{value}</span>
  </div>
);

/** Right-rail supplier controls: status, metrics, dates, and manage actions. */
const AdStatusSidebar = ({ ad, busy, onAction }) => (
  <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <p className="text-[13px] font-semibold text-[#64748B]">Status</p>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            STATUS_PILL[ad.status] || STATUS_PILL.Expired
          }`}
        >
          {ad.status}
        </span>
      </div>

      <div className="space-y-3 px-5 py-4">
        <MetaRow
          icon={Eye}
          label="Views"
          value={Number(ad.views || 0).toLocaleString("en-US")}
        />
        <MetaRow
          icon={MousePointerClick}
          label="Clicks"
          value={Number(ad.clicks || 0).toLocaleString("en-US")}
        />
        <MetaRow
          icon={Timer}
          label="Duration"
          value={ad.durationDays ? `${ad.durationDays} days` : "—"}
        />
        <MetaRow icon={CalendarDays} label="Start" value={ad.startDate} />
        <MetaRow icon={CalendarClock} label="Expiry" value={ad.expiryDate} />
        <MetaRow icon={Wallet} label="Price" value={ad.price} />
      </div>

      {ad.rejectionReason ? (
        <div className="border-t border-[#E4E7EC] px-5 py-4">
          <ErrorBanner>Rejection reason: {ad.rejectionReason}</ErrorBanner>
        </div>
      ) : null}

      <AdManageActions status={ad.status} busy={busy} onAction={onAction} />
    </Card>
  </aside>
);

export default AdStatusSidebar;
