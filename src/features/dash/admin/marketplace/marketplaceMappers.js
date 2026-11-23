/** Map API listings onto ListingCard / detail UI props. */
import { formatDate } from "@/shared/utils/dates/date";

export const MARKETPLACE_CATEGORY_OPTIONS = [
  "All",
  "Chromatography",
  "Spectroscopy",
  "Incubation",
  "Centrifugation",
  "Weighing",
  "Safety",
  "Consumables",
  "Microscopy",
  "Other",
];

const CATEGORY_TO_API = {
  All: undefined,
  Chromatography: "CHROMATOGRAPHY",
  Spectroscopy: "SPECTROSCOPY",
  Incubation: "INCUBATION",
  Centrifugation: "CENTRIFUGATION",
  Weighing: "WEIGHING",
  Safety: "SAFETY",
  Consumables: "CONSUMABLES",
  Microscopy: "MICROSCOPY",
  Other: "OTHER",
};

const CATEGORY_LABEL = {
  CHROMATOGRAPHY: "Chromatography",
  SPECTROSCOPY: "Spectroscopy",
  INCUBATION: "Incubation",
  CENTRIFUGATION: "Centrifugation",
  WEIGHING: "Weighing",
  SAFETY: "Safety",
  CONSUMABLES: "Consumables",
  MICROSCOPY: "Microscopy",
  OTHER: "Other",
};

const CONDITION_LABEL = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  REFURBISHED: "Refurbished",
  FOR_PARTS: "For Parts",
};

export const categoryToApi = (label) => CATEGORY_TO_API[label];

export function formatListedAt(dateValue) {
  return formatDate(dateValue, { format: "monthYear" });
}

export function toListingCardModel(listing) {
  if (!listing) return null;

  const seller = listing.seller || {};
  const name =
    seller.name ||
    [seller.firstName, seller.lastName].filter(Boolean).join(" ") ||
    "Seller";
  const initials =
    seller.initials ||
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") ||
    "S";

  const images = Array.isArray(listing.images)
    ? listing.images.filter(Boolean)
    : [];
  const image = listing.image || images[0] || "";

  return {
    ...listing,
    condition: CONDITION_LABEL[listing.condition] || listing.condition,
    category: CATEGORY_LABEL[listing.category] || listing.category,
    year: listing.year ?? "—",
    price: Number(listing.price) || 0,
    location: listing.location || "—",
    image,
    images: images.length ? images : image ? [image] : [],
    listedAt: formatListedAt(listing.listedAt),
    seller: {
      id: seller.id,
      name,
      initials,
      title: seller.title || "Member",
      company: seller.company || "—",
      avatar: seller.avatar || null,
      avatarClass: "bg-[#E8F3FB] text-primary",
    },
  };
}
