import { AD_STATUS } from "../constant/constants";

/**
 * Table row actions by status:
 * - Pending payment → resume payment, or delete the unpaid draft
 * - Pending / Active → cancel (withdraw)
 * - Rejected        → resubmit, or delete
 * - Expired         → renew (fresh create), or delete
 * - Cancelled       → delete
 */
export const getAdRowActions = (
  row,
  { onDetails, onResubmit, onRenew, onPay, onCancel, onDelete },
) => {
  const actions = [
    { id: "details", label: "See Details", onClick: () => onDetails(row.id) },
  ];

  if (row.status === AD_STATUS.PENDING_PAYMENT) {
    actions.push({ id: "pay", label: "Pay now", onClick: () => onPay(row.id) });
    actions.push({
      id: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDelete(row.id),
    });
  }

  if (row.status === AD_STATUS.PENDING || row.status === AD_STATUS.ACTIVE) {
    actions.push({
      id: "cancel",
      label: "Cancel",
      danger: true,
      onClick: () => onCancel(row.id),
    });
  }

  if (row.status === AD_STATUS.REJECTED) {
    actions.push({ id: "resubmit", label: "Resubmit", onClick: () => onResubmit(row.id) });
    actions.push({
      id: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDelete(row.id),
    });
  }

  if (row.status === AD_STATUS.EXPIRED) {
    actions.push({ id: "renew", label: "Renew", onClick: () => onRenew() });
    actions.push({
      id: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDelete(row.id),
    });
  }

  if (row.status === AD_STATUS.CANCELLED) {
    actions.push({
      id: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDelete(row.id),
    });
  }

  return actions;
};
