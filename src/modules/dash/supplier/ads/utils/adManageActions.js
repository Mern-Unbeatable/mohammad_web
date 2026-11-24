import { CreditCard, RefreshCw, RotateCcw, Trash2, XCircle } from "lucide-react";
import { AD_STATUS } from "../constant/constants";

/**
 * Detail-page manage actions by status (no "See Details").
 * Buttons are stacked in the status sidebar like admin review actions.
 */
export const getAdManageActions = (status) => {
  if (status === AD_STATUS.PENDING_PAYMENT) {
    return [
      {
        id: "pay",
        label: "Pay now",
        icon: CreditCard,
        className: "bg-primary text-white hover:bg-[#1D6BB8]",
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
      },
    ];
  }

  if (status === AD_STATUS.PENDING || status === AD_STATUS.ACTIVE) {
    return [
      {
        id: "cancel",
        label: "Cancel advertisement",
        icon: XCircle,
        className: "border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]",
      },
    ];
  }

  if (status === AD_STATUS.REJECTED) {
    return [
      {
        id: "resubmit",
        label: "Resubmit",
        icon: RotateCcw,
        className: "bg-primary text-white hover:bg-[#1D6BB8]",
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
      },
    ];
  }

  if (status === AD_STATUS.EXPIRED) {
    return [
      {
        id: "renew",
        label: "Renew",
        icon: RefreshCw,
        className: "bg-primary text-white hover:bg-[#1D6BB8]",
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
      },
    ];
  }

  if (status === AD_STATUS.CANCELLED) {
    return [
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
      },
    ];
  }

  return [];
};
