/** Map API listings onto ListingCard / detail UI props (user marketplace). */

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

export const categoryFromApi = (apiKey) =>
  CATEGORY_LABEL[apiKey] || "Chromatography";

export const conditionFromApi = (apiKey) =>
  CONDITION_LABEL[apiKey] || "Good";

export function formatListedAt(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
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
    id: listing.id,
    title: listing.title || "",
    description: listing.description || listing.summary || "",
    price: Number(listing.price) || 0,
    category: CATEGORY_LABEL[listing.category] || listing.category,
    condition: CONDITION_LABEL[listing.condition] || listing.condition,
    location: listing.location || "—",
    year: listing.year ?? "—",
    image,
    images: images.length ? images : image ? [image] : [],
    listedAt: formatListedAt(listing.listedAt || listing.createdAt),
    isSaved: Boolean(listing.isSaved ?? listing.saved),
    ownerId: listing.ownerId || seller.id || null,
    seller: {
      id: seller.id,
      name,
      initials,
      title: seller.title || "Member",
      company: seller.company || "—",
      avatar: seller.avatar || null,
      email: seller.email || null,
      phone: seller.phone || null,
      avatarClass: "bg-[#E8F3FB] text-primary",
    },
    raw: listing,
  };
}

export function toListingDetailModel(listing) {
  return toListingCardModel(listing);
}
