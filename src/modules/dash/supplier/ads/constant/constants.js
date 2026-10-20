export const ADS_PATH = "/supplier/ads";
export const adDetailPath = (id) => `${ADS_PATH}/${id}`;

export const ADS_PAGE_SIZE = 7;
export const SEARCH_DEBOUNCE_MS = 350;

/** Row model `status` labels that unlock extra row actions. */
export const AD_STATUS = { REJECTED: "Rejected", EXPIRED: "Expired" };

export const DEFAULT_STATUS_FILTER = "all";
export const DEFAULT_SORT = "newest";

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export const DEFAULT_REJECTION =
  "The advertisement does not meet Lab Unity's advertising guidelines. Please review and resubmit.";
