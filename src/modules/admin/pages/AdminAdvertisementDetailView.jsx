import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { Ban, Calendar, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import RichText from "@/components/data-display/RichText/RichText";
import { AdvertisementDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelBackButton from "@/shared/layout/PanelLayout/PanelBackButton";
import ReasonModal from "@/modules/admin/components/ReasonModal";
import {
  fetchAdDetails,
  clearSelectedAd,
  reviewAdvertisement,
} from "@/features/admin/advertisements";
import {
  statusLabelToReviewApi,
  toAdDetailModel,
} from "@/features/admin/advertisements/adsMappers";

const STATUS_PILL = {
  Active: "bg-green-secondary text-green-primary",
  Pending: "bg-[#FFFAEB] text-[#B54708]",
  Expired: "bg-[#F3F4F6] text-[#475467]",
  Rejected: "bg-[#FEF3F2] text-[#D92D20]",
};

const ACTIONS = [
  {
    label: "Active",
    text: "Approve",
    icon: CheckCircle2,
    className: "bg-green-primary text-white hover:bg-[#067647]",
  },
  {
    label: "Expired",
    text: "Mark expired",
    icon: Clock3,
    className:
      "border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]",
  },
  {
    label: "Rejected",
    text: "Reject",
    icon: Ban,
    className: "bg-[#D92D20] text-white hover:bg-[#B42318]",
  },
];

const AdminAdvertisementDetailView = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();

  const { selectedAd, actionLoading } = useSelector((state) => state.adminAds);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loadError, setLoadError] = useState({ id: null, message: "" });

  useEffect(() => {
    if (!adId) return undefined;
    let cancelled = false;
    dispatch(fetchAdDetails(adId)).then((result) => {
      if (!cancelled && fetchAdDetails.rejected.match(result)) {
        setLoadError({
          id: adId,
          message: result.payload || "Advertisement not found",
        });
      }
    });
    return () => {
      cancelled = true;
      dispatch(clearSelectedAd());
    };
  }, [dispatch, adId]);

  const ad = useMemo(
    () => (selectedAd?.id === adId ? toAdDetailModel(selectedAd) : null),
    [selectedAd, adId],
  );

  const handleReview = async (label, rejectionReason) => {
    const result = await dispatch(
      reviewAdvertisement({
        adId,
        status: statusLabelToReviewApi(label),
        rejectionReason,
      }),
    );
    if (reviewAdvertisement.fulfilled.match(result)) {
      toast.success(`Advertisement marked ${label}`);
      return;
    }
    toast.error(result.payload || "Failed to update advertisement");
  };

  if (!ad && loadError.id === adId) {
    return (
      <PanelPage>
        <PanelBackButton fallback="/admin/advertisement" />
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-[16px] font-semibold text-deep-blue">
            {loadError.message}
          </p>
        </div>
      </PanelPage>
    );
  }

  if (!ad) {
    return (
      <PanelPage>
        <AdvertisementDetailSkeleton />
      </PanelPage>
    );
  }

  return (
    <PanelPage>
      <PanelBackButton fallback="/admin/advertisement" />

      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-secondary text-[13px] font-bold text-green-primary">
              {ad.companyInitials}
            </div>
            <div>
              <p className="text-[15px] font-bold text-deep-blue">
                {ad.company}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {ad.category}
                </span>
                <span>{ad.location}</span>
              </div>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              STATUS_PILL[ad.status] || STATUS_PILL.Expired
            }`}
          >
            {ad.status}
          </span>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div>
            <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[24px]">
              {ad.title}
            </h1>
            <RichText
              text={ad.description}
              className="mt-3 text-[14px] leading-relaxed text-[#475467]"
            />
          </div>

          {ad.image ? (
            <img
              src={ad.image}
              alt=""
              className="aspect-[16/9] w-full rounded-xl object-cover"
            />
          ) : null}

          {ad.rejectionReason ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Rejection reason: {ad.rejectionReason}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4 text-[13px] text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Start Date: {ad.startDate}
            </span>
            <span className="font-semibold text-pink-light">
              Expiry Date: {ad.expiryDate}
            </span>
          </div>

          <p className="text-[24px] font-bold text-deep-blue">{ad.price}</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E4E7EC] bg-[#F9FAFB] px-5 py-4 sm:px-6">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={actionLoading || ad.status === action.label}
              onClick={() =>
                action.label === "Rejected"
                  ? setRejectOpen(true)
                  : handleReview(action.label)
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
            >
              <action.icon className="h-4 w-4" />
              {action.text}
            </button>
          ))}
        </div>
      </Card>

      <ReasonModal
        open={rejectOpen}
        title="Reject advertisement"
        submitLabel="Reject"
        placeholder="Why reject this advertisement?"
        description={`Rejecting "${ad.title}" will remove it from active promotion.`}
        onClose={() => setRejectOpen(false)}
        onConfirm={(reason) => handleReview("Rejected", reason)}
      />
    </PanelPage>
  );
};

export default AdminAdvertisementDetailView;
