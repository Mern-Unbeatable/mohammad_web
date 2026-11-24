import { Eye, MousePointerClick, Users } from "lucide-react";
import { formatDate as formatSharedDate } from "@/shared/utils/dates/date";
import { adDetailPath } from "@/modules/dash/admin/ads";
import { listingDetailPath } from "@/modules/dash/admin/marketplace";
import { jobDetailPath } from "@/modules/dash/admin/recruitment";
import { CONTENT_TABS, POSTS_TAB } from "../constant/constants";

const formatDate = (value) => formatSharedDate(value, { format: "short" });

export const formatPrice = (value) =>
  value == null ? "" : `€${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/** "FOR_SALE" → "For sale". */
export const capitalize = (text) =>
  text ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, " ") : "";

/** Link, meta line and stats for one content row, per kind. */
export const ROW_DETAILS = {
  advertisements: (ad) => ({
    href: adDetailPath(ad.id),
    meta: [capitalize(ad.category), formatDate(ad.createdAt)],
    stats: [
      { icon: Eye, value: ad.views ?? 0, label: "views" },
      { icon: MousePointerClick, value: ad.clicks ?? 0, label: "clicks" },
    ],
  }),
  listings: (listing) => ({
    href: listingDetailPath(listing.id),
    meta: [formatPrice(listing.price), capitalize(listing.category), formatDate(listing.createdAt)],
    stats: [],
  }),
  jobs: (job) => ({
    href: jobDetailPath(job.id),
    meta: [job.company, formatDate(job.createdAt)],
    stats: [{ icon: Users, value: job.applicationsCount ?? 0, label: "applicants" }],
  }),
};

/** Posts tab first, then one tab per content kind with its count ("…" while loading). */
export const buildActivityTabs = ({ postsTotal, kinds, content, contentLoading }) => [
  { ...POSTS_TAB, count: postsTotal },
  ...kinds.map((kind) => ({
    id: kind,
    ...CONTENT_TABS[kind],
    count: contentLoading ? "…" : (content?.[kind]?.total ?? 0),
  })),
];
