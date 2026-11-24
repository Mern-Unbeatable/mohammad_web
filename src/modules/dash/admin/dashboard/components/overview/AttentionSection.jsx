import { Link } from "react-router";
import {
  ArrowRight,
  Megaphone,
  ShieldAlert,
  ChevronRight,
  Inbox,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { formatDate } from "@/shared/utils/dates/date";
import { AdCell, SupplierCell } from "@/modules/dash/admin/ads";

const CATEGORY_LABEL = {
  PRODUCT: "Product Showcase",
  SERVICE: "Service Offering",
  PROMO: "Promotional Offer",
  WEBINAR: "Webinar/Event",
};

const reasonLabel = (reason = "") =>
  String(reason)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const adCategoryLabel = (category = "") => CATEGORY_LABEL[category] || category;

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
              <h2 className="text-[15px] font-bold text-deep-blue">
                Reports queue
              </h2>
              <p className="text-[12px] text-[#64748B]">
                Cases waiting for moderation
              </p>
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
                          {report.reportedUser
                            ? ` · ${report.reportedUser}`
                            : ""}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[12px] text-[#64748B]">
                          {report.snippet || `Reported by ${report.reporter}`}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
                      {formatDate(report.createdAt, {
                        format: "short",
                        fallback: "—",
                      })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-pink-secondary text-pink-light">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-deep-blue">
                  Ads to review
                </h2>
                {ads.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                    {ads.length} pending
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#64748B]">
                Paid ads awaiting approval
              </p>
            </div>
          </div>
          <Link
            to="/admin/advertisement"
            className="inline-flex items-center gap-1 rounded-md text-[12px] font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Body */}
        {ads.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F5F7] text-[#98A2B3]">
              <Inbox className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-[13px] font-medium text-deep-blue">
              You're all caught up
            </p>
            <p className="text-[12px] text-[#64748B]">
              No advertisements are waiting for review.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-[#F4F5F7]">
            {ads.map((ad) => {
              const supplierName =
                ad.supplierName || ad.supplier || "Unknown supplier";
              return (
                <li key={ad.id}>
                  <Link
                    to={`/admin/advertisement/${ad.id}`}
                    className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#F8FAFC] focus:outline-none focus-visible:bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                    aria-label={`Review ad: ${ad.title} from ${supplierName}`}
                  >
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[12px] font-semibold text-primary">
                      {ad.supplierAvatar ? (
                        <img
                          src={ad.supplierAvatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span>{ad.supplierInitials || "AD"}</span>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[14px] font-semibold text-deep-blue">
                          {ad.title}
                        </p>
                        <span className="hidden shrink-0 rounded-md bg-[#F4F5F7] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#475467] sm:inline">
                          {adCategoryLabel(ad.category)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[#64748B]">
                        <span className="truncate">{supplierName}</span>
                        {ad.supplierCompany && (
                          <>
                            <span aria-hidden="true" className="text-[#D0D5DD]">
                              •
                            </span>
                            <span className="truncate">
                              {ad.supplierCompany}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true" className="text-[#D0D5DD]">
                          •
                        </span>
                        <time dateTime={ad.createdAt}>
                          {formatDate(ad.createdAt, {
                            format: "short",
                            fallback: "—",
                          })}
                        </time>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="hidden shrink-0 items-center gap-1 rounded-md bg-primary/5 px-2.5 py-1 text-[12px] font-semibold text-primary group-hover:bg-primary/10 sm:inline-flex">
                      Review
                      <ChevronRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-[#98A2B3] sm:hidden"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AttentionSection;
