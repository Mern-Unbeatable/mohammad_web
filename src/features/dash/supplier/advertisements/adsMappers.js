/** Map API advertisements onto supplier list / detail UI props. */

const STATUS_LABEL = {
  PENDING: "Pending",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

const STATUS_FILTER_API = {
  all: undefined,
  active: "ACTIVE",
  pending: "PENDING",
  expired: "EXPIRED",
  rejected: "REJECTED",
};

const CATEGORY_LABEL = {
  PRODUCT: "Product Showcase",
  SERVICE: "Service Offering",
  PROMO: "Promotional Offer",
  WEBINAR: "Webinar/Event",
};

const CATEGORY_API = {
  product: "PRODUCT",
  service: "SERVICE",
  promo: "PROMO",
  webinar: "WEBINAR",
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const statusFilterToApi = (value) => STATUS_FILTER_API[value];

export const categoryIdToApi = (categoryId) =>
  CATEGORY_API[categoryId] || "PRODUCT";

/** Tier ids follow the API's `sponsored_pricing` format: `7-days`, `14-days`, … */
export const durationDaysToId = (days) =>
  Number.isInteger(days) && days > 0 ? `${days}-days` : "";

export const durationIdToDays = (durationId) => {
  const match = /^(\d+)-days$/.exec(durationId || "");
  return match ? Number(match[1]) : undefined;
};

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
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

/** Advertising fee — whole euros stay compact (€35), cents are kept (€35.50). */
export function formatAdFee(amount, currency = "EUR") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  const digits = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Map `GET /advertisements/pricing` onto Duration step tiers. Dates are
 * estimates from `fromDate`; the real window starts when an admin approves.
 */
export function toDurationTiers(pricing, fromDate = new Date()) {
  const tiers = Array.isArray(pricing?.tiers) ? pricing.tiers : [];
  const currency = pricing?.currency || "EUR";
  return tiers.map((tier) => ({
    id: tier.id,
    days: tier.days,
    label: `${tier.days} days`,
    price: Number(tier.price),
    priceLabel: formatAdFee(tier.price, currency),
    popular: Boolean(tier.popular),
    startDate: formatDisplayDate(fromDate),
    endDate: formatDisplayDate(new Date(fromDate.getTime() + tier.days * DAY_MS)),
  }));
}

export const defaultDurationId = (pricing) =>
  durationDaysToId(pricing?.defaultDurationDays);

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

export function toAdDetailModel(ad) {
  if (!ad) return null;

  const supplier = ad.supplier || {};
  const company =
    supplier.company ||
    supplier.name ||
    [supplier.firstName, supplier.lastName].filter(Boolean).join(" ") ||
    "Your company";

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
    stats: {
      reactions: 0,
      comments: 0,
      shares: 0,
    },
    raw: ad,
  };
}

const fileNameFromUrl = (url) => {
  if (!url) return "";
  try {
    const name = new URL(url).pathname.split("/").filter(Boolean).pop();
    return name ? decodeURIComponent(name) : "";
  } catch {
    return "";
  }
};

/**
 * Map an API advertisement back onto CreateAdModal form state (resubmit).
 */
export function adToForm(ad) {
  const categoryId =
    Object.keys(CATEGORY_API).find((id) => CATEGORY_API[id] === ad?.category) ||
    "product";
  const durationId = durationDaysToId(ad?.durationDays);

  return {
    categoryId,
    title: ad?.title || "",
    description: ad?.description || "",
    price: ad?.price === null || ad?.price === undefined ? "" : String(ad.price),
    contact: ad?.contact || "",
    eventDate: ad?.eventDate ? String(ad.eventDate).slice(0, 10) : "",
    eventTime: ad?.eventTime || "",
    location: ad?.location || "",
    organizer: ad?.organizer || "",
    durationId,
    imageUrl: ad?.imageUrl || "",
    videoUrl: ad?.videoUrl || "",
    imageName: fileNameFromUrl(ad?.imageUrl),
    videoName: fileNameFromUrl(ad?.videoUrl),
  };
}

/**
 * Build create/update body from CreateAdModal form state.
 */
export function formToCreatePayload(form) {
  const payload = {
    title: String(form.title || "").trim(),
    category: categoryIdToApi(form.categoryId),
    description: String(form.description || "").trim(),
  };

  const durationDays = durationIdToDays(form.durationId);
  if (durationDays) payload.durationDays = durationDays;
  if (form.price !== "" && form.price != null) {
    const price = Number(form.price);
    if (!Number.isNaN(price)) payload.price = price;
  }
  if (form.contact?.trim()) payload.contact = form.contact.trim();
  if (form.location?.trim()) payload.location = form.location.trim();
  if (form.organizer?.trim()) payload.organizer = form.organizer.trim();
  if (form.eventDate) payload.eventDate = form.eventDate;
  if (form.eventTime?.trim()) payload.eventTime = form.eventTime.trim();
  if (form.imageUrl) payload.imageUrl = form.imageUrl;
  if (form.videoUrl) payload.videoUrl = form.videoUrl;

  return payload;
}
