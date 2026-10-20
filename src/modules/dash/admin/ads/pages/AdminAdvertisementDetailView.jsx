import { useParams } from "react-router";
import Card from "@/components/ui/Card";
import { AdvertisementDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelBackButton from "@/components/navigation/panel/PanelBackButton";
import AdHeader from "../components/detail/AdHeader";
import AdBody from "../components/detail/AdBody";
import ReviewActions from "../components/detail/ReviewActions";
import AdLoadError from "../components/detail/AdLoadError";
import RejectAdModal from "../components/common/RejectAdModal";
import { useAdminAdDetail } from "../hooks/useAdminAdDetail";
import { ADS_PATH } from "../constant/constants";

const AdminAdvertisementDetailView = () => {
  const { adId } = useParams();
  const detail = useAdminAdDetail(adId);
  const { ad } = detail;

  if (detail.status === "error") {
    return (
      <PanelPage>
        <PanelBackButton fallback={ADS_PATH} />
        <AdLoadError message={detail.errorMessage} />
      </PanelPage>
    );
  }

  if (detail.status === "loading") {
    return (
      <PanelPage>
        <AdvertisementDetailSkeleton />
      </PanelPage>
    );
  }

  return (
    <PanelPage>
      <PanelBackButton fallback={ADS_PATH} />

      <Card className="overflow-hidden">
        <AdHeader ad={ad} />
        <AdBody ad={ad} />
        <ReviewActions
          status={ad.status}
          busy={detail.busy}
          onReview={detail.review}
          onReject={detail.openReject}
        />
      </Card>

      <RejectAdModal
        open={detail.rejectOpen}
        title={ad.title}
        onClose={detail.closeReject}
        onConfirm={detail.confirmReject}
      />
    </PanelPage>
  );
};

export default AdminAdvertisementDetailView;
