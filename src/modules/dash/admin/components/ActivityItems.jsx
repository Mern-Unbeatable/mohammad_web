import { Link } from "react-router";
import { Eye, ImageOff, MousePointerClick, Users } from "lucide-react";
import { formatDate as formatSharedDate } from "@/shared/utils/date";

const STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  OPEN: "bg-green-secondary text-green-primary",
  PENDING: "bg-[#FFFAEB] text-[#B54708]",
  SOLD: "bg-secondary text-primary",
  EXPIRED: "bg-[#F3F4F6] text-[#475467]",
  CLOSED: "bg-[#FEF3F2] text-[#D92D20]",
  REJECTED: "bg-[#FEF3F2] text-[#D92D20]",
  REMOVED: "bg-[#FEF3F2] text-[#D92D20]",
};

const formatDate = (value) => formatSharedDate(value, { format: "short" });

const formatPrice = (value) =>
  value == null
    ? ""
    : `€${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const capitalize = (text) =>
  text ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, " ") : "";

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

const GRID_CLASS =
  "grid grid-cols-1 gap-3 p-4 sm:px-6 md:grid-cols-2 2xl:grid-cols-3";

const ContentRow = ({ item, details }) => (
  <li className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] p-3 transition-colors hover:border-primary/40">
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

/** Underlined tab row; each tab is `{ id, label, icon, count? }`. */
export const ActivityTabBar = ({
  tabs,
  activeId,
  onChange,
  className = "",
}) => (
  <div
    role="tablist"
    className={`flex gap-1 border-b border-[#E4E7EC] px-3 pt-2 sm:px-4 ${className}`}
  >
    {tabs.map((item) => {
      const selected = item.id === activeId;
      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(item.id)}
          className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
            selected
              ? "border-primary text-primary"
              : "border-transparent text-[#64748B] hover:text-deep-blue"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.count != null ? (
            <span
              className={`rounded-full px-1.5 py-px text-[11px] ${
                selected
                  ? "bg-secondary text-primary"
                  : "bg-[#F3F4F6] text-[#64748B]"
              }`}
            >
              {item.count}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);

/** Rows for one content kind (`advertisements` | `listings` | `jobs`). */
export const ActivityItems = ({
  kind,
  section,
  loading,
  empty,
  gridClassName = GRID_CLASS,
}) => {
  if (loading) {
    return (
      <ul className={gridClassName}>
        {[0, 1, 2].map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] p-3"
          >
            <span className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[#E4E7EC]" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-2/3 animate-pulse rounded bg-[#E4E7EC]" />
              <span className="block h-3 w-1/3 animate-pulse rounded bg-[#E4E7EC]" />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (!section?.items?.length) {
    return (
      <p className="px-5 py-10 text-center text-[14px] text-[#64748B] sm:px-6">
        {empty}
      </p>
    );
  }

  return (
    <>
      <ul className={gridClassName}>
        {section.items.map((item) => (
          <ContentRow
            key={item.id}
            item={item}
            details={rowDetails[kind](item)}
          />
        ))}
      </ul>
      {section.total > section.items.length ? (
        <p className="border-t border-[#E4E7EC] px-5 py-3 text-[12px] text-[#64748B] sm:px-6">
          Showing the latest {section.items.length} of {section.total}.
        </p>
      ) : null}
    </>
  );
};
