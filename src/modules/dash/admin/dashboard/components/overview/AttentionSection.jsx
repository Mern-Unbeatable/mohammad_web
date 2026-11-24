import { Link } from "react-router";
import { ArrowRight, Megaphone, ShieldAlert } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { formatDate } from "@/shared/utils/dates/date";

const reasonLabel = (reason = "") =>
  String(reason)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const EmptyQueue = ({ label }) => (
  <p className="px-1 py-6 text-center text-[13px] text-[#98A2B3]">{label}</p>
);

const QueueSkeleton = () => (
  <Card className="min-h-[220px] animate-pulse p-5">
    <div className="mb-4 h-8 w-40 rounded-lg bg-[#EEF2F6]" />
    <div className="space-y-3">
      <div className="h-10 rounded-lg bg-[#F4F5F7]" />
      <div className="h-10 rounded-lg bg-[#F4F5F7]" />
      <div className="h-10 rounded-lg bg-[#F4F5F7]" />
    </div>
  </Card>
);

/** Pending reports and ads that need admin attention. */
const AttentionSection = ({ attention, loading, ready = true }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <QueueSkeleton />
        <QueueSkeleton />
      </div>
    );
  }

  if (!ready) return null;

  const reports = attention?.reports || [];
  const ads = attention?.ads || [];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3E8] text-[#E67E22]">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-deep-blue">Reports queue</h2>
              <p className="text-[12px] text-[#64748B]">Cases waiting for moderation</p>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {reports.length === 0 ? (
          <EmptyQueue label="No pending reports right now." />
        ) : (
          <ul className="divide-y divide-[#F4F5F7]">
            {reports.map((report) => (
              <li key={report.id}>
                <Link
                  to={`/admin/reports/${report.id}`}
                  className="block px-5 py-3.5 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Avatar
                        src={report.avatar}
                        alt={report.reportedUser || report.reporter || ""}
                        initials={report.initials || "U"}
                        size="sm"
                        className="!h-8 !w-8 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-deep-blue">
                          {reasonLabel(report.reason)}
                          {report.reportedUser ? ` · ${report.reportedUser}` : ""}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[12px] text-[#64748B]">
                          {report.snippet || `Reported by ${report.reporter}`}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
                      {formatDate(report.createdAt, { format: "short", fallback: "—" })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pink-secondary text-pink-light">
              <Megaphone className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-deep-blue">Ads to review</h2>
              <p className="text-[12px] text-[#64748B]">Paid ads awaiting approval</p>
            </div>
          </div>
          <Link
            to="/admin/advertisement"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {ads.length === 0 ? (
          <EmptyQueue label="No advertisements waiting for review." />
        ) : (
          <ul className="divide-y divide-[#F4F5F7]">
            {ads.map((ad) => (
              <li key={ad.id}>
                <Link
                  to={`/admin/advertisement/${ad.id}`}
                  className="block px-5 py-3.5 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-deep-blue">{ad.title}</p>
                      <p className="mt-0.5 truncate text-[12px] text-[#64748B]">
                        {[ad.supplier, ad.category].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
                      {formatDate(ad.createdAt, { format: "short", fallback: "—" })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AttentionSection;
