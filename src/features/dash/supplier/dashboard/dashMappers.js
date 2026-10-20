import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Megaphone,
  Send,
} from "lucide-react";

/** Map ads + notifications onto supplier dashboard UI props. */

const STATUS_LABEL = {
  PENDING: "Pending",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

const CATEGORY_LABEL = {
  PRODUCT: "Product Showcase",
  SERVICE: "Service Offering",
  PROMO: "Promotional Offer",
  WEBINAR: "Webinar/Event",
};

const CHART_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatUploadDate = (dateValue) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
};

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US");
};

const notificationVisual = (type) => {
  switch (type) {
    case "AD_APPROVED":
      return {
        icon: CheckCircle2,
        iconClass: "bg-green-secondary text-green-primary",
      };
    case "AD_REJECTED":
    case "AD_EXPIRING":
      return {
        icon: AlertTriangle,
        iconClass: "bg-[#FEF3E8] text-[#E67E22]",
      };
    default:
      return {
        icon: Clock,
        iconClass: "bg-secondary text-primary",
      };
  }
};

export function toAdRowModel(ad) {
  if (!ad) return null;
  return {
    id: ad.id,
    title: ad.title,
    category: CATEGORY_LABEL[ad.category] || ad.category,
    status: STATUS_LABEL[ad.status] || ad.status,
    views:
      ad.status === "PENDING" || ad.status === "REJECTED"
        ? "—"
        : Number(ad.views || 0).toLocaleString("en-US"),
    clicks:
      ad.status === "PENDING" || ad.status === "REJECTED"
        ? "—"
        : Number(ad.clicks || 0).toLocaleString("en-US"),
    duration: `${ad.durationDays || 7} Days`,
    uploadDate: formatUploadDate(ad.uploadDate || ad.createdAt),
    raw: ad,
  };
}

export function buildDashboardStats(ads = []) {
  const active = ads.filter((ad) => ad.status === "ACTIVE").length;
  const pending = ads.filter((ad) => ad.status === "PENDING").length;
  const views = ads.reduce((sum, ad) => sum + Number(ad.views || 0), 0);
  const clicks = ads.reduce((sum, ad) => sum + Number(ad.clicks || 0), 0);

  return [
    {
      id: "active",
      icon: Megaphone,
      label: "Active Advertisements",
      value: String(active).padStart(2, "0"),
      tone: "green",
      hint: "Currently running",
    },
    {
      id: "pending",
      icon: Clock,
      label: "Pending Approval",
      value: String(pending).padStart(2, "0"),
      tone: "orange",
      hint: "Awaiting admin review",
    },
    {
      id: "views",
      icon: Eye,
      label: "Total Views",
      value: views.toLocaleString("en-US"),
      tone: "blue",
      hint: "Across all advertisements",
    },
    {
      id: "clicks",
      icon: Send,
      label: "Total Clicks",
      value: clicks.toLocaleString("en-US"),
      tone: "purple",
      hint: "Advertisement interactions",
    },
  ];
}

/**
 * Bucket views/clicks by calendar month of upload (or start) within `year`.
 */
export function buildPerformanceChart(ads = [], year = new Date().getFullYear()) {
  const viewsByMonth = Array(12).fill(0);
  const clicksByMonth = Array(12).fill(0);

  ads.forEach((ad) => {
    const raw = ad.startDate || ad.uploadDate || ad.createdAt;
    if (!raw) return;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return;
    const month = date.getMonth();
    viewsByMonth[month] += Number(ad.views || 0);
    clicksByMonth[month] += Number(ad.clicks || 0);
  });

  const peak = Math.max(0, ...viewsByMonth, ...clicksByMonth);
  const step = peak <= 100 ? 25 : peak <= 500 ? 100 : peak <= 2000 ? 400 : 1000;
  const yMax = Math.max(step, Math.ceil(peak / step) * step || step);
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((yMax / 4) * i));

  return {
    title: "Advertisement Performance",
    labels: CHART_MONTHS,
    yMax,
    yTicks,
    series: [
      {
        id: "views",
        label: "View",
        color: "#EC4899",
        values: viewsByMonth,
      },
      {
        id: "clicks",
        label: "Clicks",
        color: "#22C55E",
        values: clicksByMonth,
      },
    ],
  };
}

export function toNotificationModel(item) {
  if (!item) return null;
  const visual = notificationVisual(item.type);
  return {
    id: item.id,
    icon: visual.icon,
    iconClass: visual.iconClass,
    title: item.title || "Notification",
    subtitle: item.subtitle || "",
    time: formatRelativeTime(item.createdAt),
    link: item.link || null,
    read: Boolean(item.read),
    raw: item,
  };
}

export function mapDashboardPayload({ ads = [], notifications = [] }, year) {
  const recentAds = ads.slice(0, 5).map(toAdRowModel).filter(Boolean);
  return {
    stats: buildDashboardStats(ads),
    chart: buildPerformanceChart(ads, year),
    recentAds,
    notifications: notifications.map(toNotificationModel).filter(Boolean),
  };
}
