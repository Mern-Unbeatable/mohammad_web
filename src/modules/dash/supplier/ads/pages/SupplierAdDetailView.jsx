import { Navigate, useParams } from "react-router";
import { AdvertisementDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
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
