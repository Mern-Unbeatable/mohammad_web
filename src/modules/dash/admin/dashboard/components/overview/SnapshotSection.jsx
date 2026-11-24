import { Briefcase, ShieldAlert, Tag, UserPlus } from "lucide-react";
import Card from "@/components/ui/Card";

const toneStyles = {
  pink: "bg-pink-secondary text-pink-light",
  orange: "bg-[#FEF3E8] text-[#E67E22]",
  teal: "bg-[#E6FFFA] text-[#0D9488]",
  purple: "bg-[#F3E8FF] text-[#7C3AED]",
};

const SnapshotItem = ({ label, value, icon: Icon, tone }) => (
  <div className="flex items-start gap-3 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3">
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
        toneStyles[tone] || toneStyles.pink
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">{label}</p>
      <p className="mt-1 text-[20px] font-bold text-deep-blue">{value}</p>
    </div>
  </div>
);

/** Secondary month snapshot metrics under the main KPI row. */
const SnapshotSection = ({ snapshot, loading }) => {
  if (loading || !snapshot) return null;

  const items = [
    {
      label: "New subscribers (month)",
      value: snapshot.newSubscribers ?? 0,
      icon: UserPlus,
      tone: "pink",
    },
    {
      label: "New jobs (month)",
      value: snapshot.newJobs ?? 0,
      icon: Briefcase,
      tone: "orange",
    },
    {
      label: "Marketplace listings",
      value: snapshot.totalListings ?? 0,
      icon: Tag,
      tone: "teal",
    },
    {
      label: "Open moderation",
      value: (snapshot.pendingReports ?? 0) + (snapshot.pendingAds ?? 0),
      icon: ShieldAlert,
      tone: "purple",
    },
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-deep-blue">This month at a glance</h2>
        <p className="text-[12px] text-[#64748B]">Extra platform activity beyond the top KPIs</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <SnapshotItem key={item.label} {...item} />
        ))}
      </div>
    </Card>
  );
};

export default SnapshotSection;
