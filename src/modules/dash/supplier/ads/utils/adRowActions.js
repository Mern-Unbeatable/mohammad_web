import { AD_STATUS } from "../constant/constants";

/**
 * Table row actions: always "See Details"; rejected ads can be resubmitted,
 * expired ads renewed (a fresh create).
 */
export const getAdRowActions = (row, { onDetails, onResubmit, onRenew }) => {
  const actions = [
    { id: "details", label: "See Details", onClick: () => onDetails(row.id) },
  ];

  if (row.status === AD_STATUS.REJECTED) {
    actions.push({ id: "resubmit", label: "Resubmit", onClick: () => onResubmit(row.id) });
  }

  if (row.status === AD_STATUS.EXPIRED) {
    actions.push({ id: "renew", label: "Renew", onClick: () => onRenew() });
  }

  return actions;
};
