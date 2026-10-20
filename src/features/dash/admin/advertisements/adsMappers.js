/** Map API advertisements onto admin table / detail UI props. */

const STATUS_LABEL = {
  PENDING: "Pending",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

const STATUS_FILTER_API = {
  all: undefined,
  pending: "PENDING",
  active: "ACTIVE",
  expired: "EXPIRED",
  rejected: "REJECTED",
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
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US");
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
    uploadDate: formatUploadDate(ad.uploadDate),
    raw: ad,
  };
}

export function toAdDetailModel(ad) {
  if (!ad) return null;

  const supplier = ad.supplier || {};
  const company =
    supplier.company ||
    supplier.name ||
    [supplier.firstName, supplier.lastName].filter(Boolean).join(" ") ||
    "Lab Unity Partner";

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
    raw: ad,
  };
}
