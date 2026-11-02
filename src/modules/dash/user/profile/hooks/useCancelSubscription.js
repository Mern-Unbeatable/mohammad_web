import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { cancelSubscription } from "@/features/dash/user/subscriptions";
import { fetchUserProfile } from "@/features/dash/user/profile";

/** Cancel the signed-in account's subscription behind a confirm dialog. */
export function useCancelSubscription({ canCancel, isTrial }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.userSubscriptions);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const confirm = async () => {
    if (!canCancel || saving) return;
    const result = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(result)) {
      setConfirmOpen(false);
      toast.success(
        isTrial ? "Trial cancelled" : "Subscription cancelled — access continues until period end",
      );
      dispatch(fetchUserProfile());
    } else if (cancelSubscription.rejected.match(result)) {
      toast.error(result.payload || "Failed to cancel subscription");
    }
  };

  return {
    saving,
    confirmOpen,
    open: () => setConfirmOpen(true),
    close: () => {
      if (!saving) setConfirmOpen(false);
    },
    confirm,
  };
}
