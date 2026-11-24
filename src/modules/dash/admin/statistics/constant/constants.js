export const STATISTICS_PATH = "/admin/statistics";

export const PAGE_TITLE = "Revenue Statistics";
export const PAGE_SUBTITLE = "Full analytics for your Lab Unity platform.";

const NEW_USERS = { key: "newUsers", color: "#F97316" };
const SUBSCRIBERS = { key: "newSubscribers", color: "#EC4899" };
const MONTHLY = { key: "monthlyRevenue", color: "#10B981" };
const YEARLY = { key: "yearlyRevenue", color: "#3B82F6" };

/**
 * Charts in display order. `id` keys the per-chart period; each line reads
 * `statistics.series[key]`.
 */
export const CHARTS = [
  {
    id: "userGrowth",
    title: "User Growth",
    lines: [
      { ...NEW_USERS, id: "newUsers", label: "New Users" },
      { ...SUBSCRIBERS, id: "newSubscribers", label: "Subscribers" },
    ],
  },
  {
    id: "revenue",
    title: "Revenue",
    lines: [
      { ...MONTHLY, id: "monthlyRevenue", label: "Monthly Revenue (€)" },
      { ...YEARLY, id: "yearlyRevenue", label: "Yearly Revenue (€)" },
    ],
  },
  {
    id: "newUsers",
    title: "New Users",
    lines: [{ ...NEW_USERS, id: "newUsersOnly", label: "New Users" }],
  },
  {
    id: "monthlyRev",
    title: "Monthly Subscription Revenue",
    lines: [{ ...MONTHLY, id: "monthlyOnly", label: "Monthly (€)" }],
  },
  {
    id: "subscribers",
    title: "New Subscribers",
    lines: [{ ...SUBSCRIBERS, id: "subsOnly", label: "Subscribers" }],
  },
  {
    id: "yearlyRev",
    title: "Yearly Subscription Revenue",
    lines: [{ ...YEARLY, id: "yearlyOnly", label: "Yearly (€)" }],
  },
];
