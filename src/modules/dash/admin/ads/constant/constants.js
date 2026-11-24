import { Ban, CheckCircle2, Clock3 } from "lucide-react";

export const ADS_PATH = "/admin/advertisement";
export const adDetailPath = (id) => `${ADS_PATH}/${id}`;
export const supplierProfilePath = (userId) => `/admin/users/${userId}`;

export const ADS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;

/** Row / detail model `status` labels; also the labels sent to review. */
export const AD_STATUS = {
  ACTIVE: "Active",
  PENDING_PAYMENT: "Pending payment",
  PENDING: "Pending",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
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

/** Review buttons on the detail page, in display order. */
export const REVIEW_ACTIONS = [
  {
    label: AD_STATUS.ACTIVE,
    text: "Approve",
    icon: CheckCircle2,
    className: "bg-green-primary text-white hover:bg-[#067647]",
  },
  {
    label: AD_STATUS.EXPIRED,
    text: "Mark expired",
    icon: Clock3,
    className: "border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]",
  },
  {
    label: AD_STATUS.REJECTED,
    text: "Reject",
    icon: Ban,
    className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
  },
];

export const PENDING_REVIEW_MESSAGE =
  "Pending is the default submission state and cannot be set by review.";
export const DEFAULT_LOAD_ERROR = "Advertisement not found";
