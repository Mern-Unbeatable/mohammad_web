export const ADS_PATH = "/supplier/ads";
export const adDetailPath = (id) => `${ADS_PATH}/${id}`;

export const ADS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;

/** Row model `status` labels that unlock extra row actions. */
export const AD_STATUS = {
  PENDING_PAYMENT: "Pending payment",
  PENDING: "Pending",
  ACTIVE: "Active",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const DEFAULT_STATUS_FILTER = "all";

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending_payment", label: "Pending payment" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export const STATUS_PILL = {
  Active: "bg-green-secondary text-green-primary",
  "Pending payment": "bg-[#FFFAEB] text-[#B54708]",
  Pending: "bg-[#FEF9E6] text-[#B8860B]",
  Expired: "bg-[#FEF3F2] text-[#D92D20]",
  Rejected: "bg-pink-secondary text-pink-light",
  Cancelled: "bg-[#F3F4F6] text-[#475467]",
};

export const DEFAULT_REJECTION =
  "The advertisement does not meet Lab Unity's advertising guidelines. Please review and resubmit.";
