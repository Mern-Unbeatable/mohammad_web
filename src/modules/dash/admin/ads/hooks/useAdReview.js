import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  reviewAdvertisement,
  statusLabelToReviewApi,
} from "@/features/dash/admin/advertisements";
import { PENDING_REVIEW_MESSAGE } from "../constant/constants";

/** Sets an ad's status by label ("Active" / "Expired" / "Rejected") and toasts the result. */
export const useAdReview = () => {
  const dispatch = useDispatch();
  const busy = useSelector((state) => state.adminAds.actionLoading);

  const review = async (adId, label, rejectionReason) => {
    const status = statusLabelToReviewApi(label);
    if (!status) {
      toast(PENDING_REVIEW_MESSAGE);
      return;
    }

    const result = await dispatch(reviewAdvertisement({ adId, status, rejectionReason }));
    if (reviewAdvertisement.fulfilled.match(result)) {
      toast.success(`Advertisement marked ${label}`);
      return;
    }
    toast.error(result.payload || "Failed to update advertisement");
  };

  return { busy, review };
};
