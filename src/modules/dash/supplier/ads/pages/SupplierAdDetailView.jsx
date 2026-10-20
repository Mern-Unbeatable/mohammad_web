<<<<<<< HEAD
import { Navigate, useParams } from "react-router";
=======
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import AdDetailCard from "@/modules/dash/supplier/ads/components/AdDetailCard";
>>>>>>> 5ed086633093a351eba3113c20868e8c97f1f83a
import { AdvertisementDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import AdDetailCard from "../components/detail/AdDetailCard";
import AdComments from "../components/detail/AdComments";
import BackToAdsLink from "../components/detail/BackToAdsLink";
import RejectionNotice from "../components/detail/RejectionNotice";
import { useSupplierAdDetail } from "../hooks/useSupplierAdDetail";
import { useAdEngagement } from "../hooks/useAdEngagement";
import { ADS_PATH, AD_STATUS } from "../constant/constants";

const SupplierAdDetailView = () => {
  const { adId } = useParams();
  const { status, ad } = useSupplierAdDetail(adId);
  const engagement = useAdEngagement();

  if (status === "notFound") return <Navigate to={ADS_PATH} replace />;

  if (status === "loading") {
    return (
      <PanelPage>
        <PanelPageHeader title="My Advertisement Details" />
        <AdvertisementDetailSkeleton />
      </PanelPage>
    );
  }

  return (
    <PanelPage>
      <PanelPageHeader title="My Advertisement Details" />
      <BackToAdsLink />

      {ad.status === AD_STATUS.REJECTED ? <RejectionNotice reason={ad.rejectionReason} /> : null}

      <AdDetailCard
        ad={ad}
        reactionId={engagement.reactionId}
        commentsOpen={engagement.commentsOpen}
        shared={engagement.shared}
        onReact={engagement.react}
        onToggleComments={engagement.toggleComments}
        onShare={engagement.share}
      />

      {engagement.commentsOpen ? (
        <AdComments
          comments={engagement.comments}
          onAddComment={engagement.addComment}
          onLikeComment={engagement.likeComment}
        />
      ) : null}
    </PanelPage>
  );
};

export default SupplierAdDetailView;
