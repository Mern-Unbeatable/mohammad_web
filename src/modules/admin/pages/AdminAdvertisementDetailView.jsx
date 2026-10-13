import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router";
import { Calendar, ChevronLeft, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { AdvertisementDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import {
  fetchAdDetails,
  clearSelectedAd,
} from "@/features/admin/advertisements";
import { toAdDetailModel } from "@/features/admin/advertisements/adsMappers";

const AdminAdvertisementDetailView = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();

  const { selectedAd, selectedAdLoading, error } = useSelector(
    (state) => state.adminAds,
  );

  useEffect(() => {
    if (adId) {
      dispatch(fetchAdDetails(adId));
    }
    return () => {
      dispatch(clearSelectedAd());
    };
  }, [dispatch, adId]);

  const ad = useMemo(() => toAdDetailModel(selectedAd), [selectedAd]);

  if (selectedAdLoading) {
    return (
      <PanelPage>
        <AdvertisementDetailSkeleton />
      </PanelPage>
    );
  }

  if ((error && !selectedAd) || !ad) {
    return <Navigate to="/admin/advertisement" replace />;
  }

  return (
    <PanelPage>
      <Link
        to="/admin/advertisement"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Selection
      </Link>

      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-secondary text-[13px] font-bold text-green-primary">
              {ad.companyInitials}
            </div>
            <div>
              <p className="text-[15px] font-bold text-deep-blue">{ad.company}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {ad.category}
                </span>
                <span>{ad.location}</span>
              </div>
            </div>
          </div>
          <span className="rounded-full bg-green-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-primary">
            {ad.status}
          </span>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div>
            <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[24px]">
              {ad.title}
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-[#475467]">
              {ad.description}
            </p>
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
      </Card>
    </PanelPage>
  );
};

export default AdminAdvertisementDetailView;
