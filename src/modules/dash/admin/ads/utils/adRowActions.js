import { AD_STATUS } from "../constant/constants";

/**
 * Table row actions: "See Details", then Active / Expired / Rejected. A status
 * action is disabled when the ad already has it or a review is running;
 * Rejected asks for a reason first.
 */
export const getAdRowActions = (row, { busy, onDetails, onReview, onReject }) => [
  {
    id: "details",
    label: "See Details",
    onClick: () => onDetails(row.id),
  },
  {
    id: "active",
    label: AD_STATUS.ACTIVE,
    disabled: () => row.status === AD_STATUS.ACTIVE || busy,
    onClick: () => onReview(row.id, AD_STATUS.ACTIVE),
  },
  {
    id: "expired",
    label: AD_STATUS.EXPIRED,
    disabled: () => row.status === AD_STATUS.EXPIRED || busy,
    onClick: () => onReview(row.id, AD_STATUS.EXPIRED),
  },
  {
    id: "rejected",
    label: AD_STATUS.REJECTED,
    variant: "danger",
    disabled: () => row.status === AD_STATUS.REJECTED || busy,
    onClick: () => onReject(row),
  },
];

export const rejectDescription = (title) =>
  `Rejecting "${title}" will remove it from active promotion.`;
