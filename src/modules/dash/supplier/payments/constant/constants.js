export const PAYMENTS_PATH = "/supplier/payments";
export const PAYMENTS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;
export const ALL = "all";

export const KIND_FILTER_OPTIONS = [
  { value: ALL, label: "All Types" },
  { value: "advertisement", label: "Advertisement" },
  { value: "subscription", label: "Membership" },
  { value: "other", label: "Other invoices" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: ALL, label: "All Statuses" },
  { value: "paid", label: "Paid" },
  { value: "open", label: "Due" },
  { value: "failed", label: "Failed" },
  { value: "void", label: "Void" },
  { value: "uncollectible", label: "Uncollectible" },
];
