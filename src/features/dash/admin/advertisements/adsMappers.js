/** Map API advertisements onto admin table / detail UI props. */
import { formatDate, formatIsoDate } from "@/shared/utils/dates/date";

const STATUS_LABEL = {
  PENDING_PAYMENT: "Pending payment",
  PENDING: "Pending",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const STATUS_FILTER_API = {
  all: undefined,
  pending_payment: "PENDING_PAYMENT",
  pending: "PENDING",
  active: "ACTIVE",
  expired: "EXPIRED",
  rejected: "REJECTED",
  cancelled: "CANCELLED",
};

const STATUS_REVIEW_API = {
  Active: "ACTIVE",
  Expired: "EXPIRED",
  Rejected: "REJECTED",
};

const CATEGORY_LABEL = {
  PRODUCT: "Product Showcase",
  SERVICE: "Service Offering",
  PROMO: "Promotional Offer",
  WEBINAR: "Webinar/Event",
};

export const statusFilterToApi = (value) => STATUS_FILTER_API[value];
export const statusLabelToReviewApi = (label) => STATUS_REVIEW_API[label];

const initialsFromName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";

export function formatUploadDate(dateValue) {
  return formatIsoDate(dateValue, { fallback: "—" });
}

export function formatDisplayDate(dateValue) {
  return formatDate(dateValue, { format: "short", fallback: "—" });
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Contact for pricing";
  }
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function toAdRowModel(ad) {
  if (!ad) return null;

  const supplier = ad.supplier || {};
  const personName =
    supplier.name ||
    [supplier.firstName, supplier.lastName].filter(Boolean).join(" ") ||
    "";
  const company = supplier.company || "";
  const supplierName = personName || company || "Unknown supplier";

  return {
    id: ad.id,
    title: ad.title,
    category: CATEGORY_LABEL[ad.category] || ad.category,
    status: STATUS_LABEL[ad.status] || ad.status,
    supplierId: supplier.id || null,
    supplierName,
    supplierCompany: company,
    supplierAvatar: supplier.avatar || supplier.avatarUrl || "",
    supplierInitials: supplier.initials || initialsFromName(supplierName),
    views:
      ad.status === "PENDING" ||
      ad.status === "PENDING_PAYMENT" ||
      ad.status === "REJECTED" ||
      ad.status === "CANCELLED"
        ? "—"
        : Number(ad.views || 0).toLocaleString("en-US"),
    clicks:
      ad.status === "PENDING" ||
      ad.status === "PENDING_PAYMENT" ||
      ad.status === "REJECTED" ||
      ad.status === "CANCELLED"
        ? "—"
        : Number(ad.clicks || 0).toLocaleString("en-US"),
    duration: `${ad.durationDays || 7} Days`,
    uploadDate: formatUploadDate(ad.uploadDate),
    raw: ad,
  };
}

export function toAdDetailModel(ad) {
  if (!ad) return null;

  const supplier = ad.supplier || {};
  const personName =
    supplier.name ||
    [supplier.firstName, supplier.lastName].filter(Boolean).join(" ") ||
    "";
  const company = supplier.company || personName || "Lab Unity Partner";
  const creatorName = personName || company;

  return {
    id: ad.id,
    company,
    companyInitials: supplier.initials || initialsFromName(company),
    category: CATEGORY_LABEL[ad.category] || ad.category,
    location: ad.location || supplier.location || supplier.country || "—",
    title: ad.title,
    description: ad.description || "",
    image: ad.imageUrl || "",
    startDate: formatDisplayDate(ad.startDate || ad.uploadDate),
    expiryDate: formatDisplayDate(ad.expiryDate),
    price:
      ad.price !== null && ad.price !== undefined
        ? `${formatPrice(ad.price)} / unit`
        : "Contact for pricing",
    status: STATUS_LABEL[ad.status] || ad.status,
    rejectionReason: ad.rejectionReason || "",
    views: ad.views ?? 0,
    clicks: ad.clicks ?? 0,
    durationDays: ad.durationDays,
    supplierId: supplier.id || null,
    creator: {
      id: supplier.id || null,
      name: creatorName,
      title: supplier.title || "",
      company: supplier.company || "",
      location: supplier.location || supplier.country || "",
      avatar: supplier.avatar || supplier.avatarUrl || "",
      initials: supplier.initials || initialsFromName(creatorName),
    },
    raw: ad,
  };
}
