import { useState } from "react";
import { Link } from "react-router";
import {
  Briefcase,
  Eye,
  ImageOff,
  Megaphone,
  MousePointerClick,
  Store,
  Users,
} from "lucide-react";
import Card from "@/components/ui/Card";

const STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  OPEN: "bg-green-secondary text-green-primary",
  PENDING: "bg-[#FFFAEB] text-[#B54708]",
  SOLD: "bg-secondary text-primary",
  EXPIRED: "bg-[#F3F4F6] text-[#475467]",
  CLOSED: "bg-[#F3F4F6] text-[#475467]",
  REJECTED: "bg-[#FEF3F2] text-[#D92D20]",
  REMOVED: "bg-[#FEF3F2] text-[#D92D20]",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const formatPrice = (value) =>
  value == null
    ? ""
    : `€${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const capitalize = (text) =>
  text ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, " ") : "";

const TABS = [
  {
    id: "advertisements",
    label: "Ads",
    icon: Megaphone,
    empty: "No advertisements yet.",
  },
  {
    id: "listings",
    label: "Marketplace",
    icon: Store,
    empty: "No marketplace listings yet.",
  },
  { id: "jobs", label: "Jobs", icon: Briefcase, empty: "No job posts yet." },
];

const rowDetails = {
  advertisements: (ad) => ({
    href: `/admin/advertisement/${ad.id}`,
    meta: [capitalize(ad.category), formatDate(ad.createdAt)],
    stats: [
      { icon: Eye, value: ad.views ?? 0, label: "views" },
      { icon: MousePointerClick, value: ad.clicks ?? 0, label: "clicks" },
    ],
  }),
  listings: (listing) => ({
    href: `/admin/marketplace/${listing.id}`,
    meta: [
      formatPrice(listing.price),
      capitalize(listing.category),
      formatDate(listing.createdAt),
    ],
    stats: [],
  }),
  jobs: (job) => ({
    href: `/admin/recruitment/${job.id}`,
    meta: [job.company, formatDate(job.createdAt)],
    stats: [
      { icon: Users, value: job.applicationsCount ?? 0, label: "applicants" },
    ],
  }),
};

const ContentRow = ({ item, details }) => (
  <li className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg border border-[#E4E7EC] bg-white object-contain p-0.5"
      />
    ) : (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] text-[#98A2B3]">
        <ImageOff className="h-5 w-5" />
      </span>
    )}
    <div className="min-w-0 flex-1">
      <Link
        to={details.href}
        className="block truncate text-[14px] font-semibold text-deep-blue hover:text-primary hover:underline"
      >
        {item.title}
      </Link>
      <p className="mt-0.5 truncate text-[12px] text-[#64748B]">
        {details.meta.filter(Boolean).join(" · ")}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            STATUS_CLASS[item.status] || STATUS_CLASS.EXPIRED
          }`}
        >
          {item.status}
        </span>
        {details.stats.map((stat) => (
          <span
            key={stat.label}
            className="inline-flex items-center gap-1 text-[11px] text-[#64748B]"
          >
            <stat.icon className="h-3.5 w-3.5" />
            {stat.value} {stat.label}
          </span>
        ))}
      </div>
    </div>
    <Link
      to={details.href}
      aria-label={`View ${item.title}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
    >
      <Eye className="h-3.5 w-3.5" />
      View
    </Link>
  </li>
);

/** Supplier's ads, listings and jobs for the admin user page. */
const SupplierActivityCard = ({ content, loading = false }) => {
  const [activeTab, setActiveTab] = useState("advertisements");
  const tab = TABS.find((item) => item.id === activeTab);
  const section = content?.[activeTab] || { total: 0, items: [] };

  return (
    <Card>
      <div className="border-b border-primary bg-primary px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-white">Supplier activity</h2>
        <p className="mt-1 text-[13px] text-white/80">
          Ads, marketplace listings and job posts by this supplier.
        </p>
      </div>

      <div
        role="tablist"
        className="flex gap-1 border-b border-[#E4E7EC] px-3 pt-2 sm:px-4"
      >
        {TABS.map((item) => {
          const { id, label } = item;
          const selected = id === activeTab;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(id)}
              className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                selected
                  ? "border-primary text-primary"
                  : "border-transparent text-[#64748B] hover:text-deep-blue"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {label}
              <span
                className={`rounded-full px-1.5 py-px text-[11px] ${
                  selected
                    ? "bg-secondary text-primary"
                    : "bg-[#F3F4F6] text-[#64748B]"
                }`}
              >
                {loading ? "…" : (content?.[id]?.total ?? 0)}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <ul className="divide-y divide-[#E4E7EC]">
          {[0, 1, 2].map((key) => (
            <li
              key={key}
              className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
            >
              <span className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[#E4E7EC]" />
              <span className="flex-1 space-y-2">
                <span className="block h-3.5 w-2/3 animate-pulse rounded bg-[#E4E7EC]" />
                <span className="block h-3 w-1/3 animate-pulse rounded bg-[#E4E7EC]" />
              </span>
            </li>
          ))}
        </ul>
      ) : section.items.length ? (
        <>
          <ul className="divide-y divide-[#E4E7EC]">
            {section.items.map((item) => (
              <ContentRow
                key={item.id}
                item={item}
                details={rowDetails[activeTab](item)}
              />
            ))}
          </ul>
          {section.total > section.items.length ? (
            <p className="border-t border-[#E4E7EC] px-5 py-3 text-[12px] text-[#64748B] sm:px-6">
              Showing the latest {section.items.length} of {section.total}.
            </p>
          ) : null}
        </>
      ) : (
        <p className="px-5 py-10 text-center text-[14px] text-[#64748B] sm:px-6">
          {tab.empty}
        </p>
      )}
    </Card>
  );
};

export default SupplierActivityCard;
