import { useParams } from "react-router";
import Card from "@/components/ui/Card";
import { AdvertisementDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import AdHeader from "../components/detail/AdHeader";
import AdBody from "../components/detail/AdBody";
import AdControlsSidebar from "../components/detail/AdControlsSidebar";
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <div className="min-w-0">
          <Card className="overflow-hidden">
            <AdHeader ad={ad} />
            <AdBody ad={ad} />
          </Card>
        </div>

        <AdControlsSidebar
          ad={ad}
          busy={detail.busy}
          onReview={detail.review}
          onReject={detail.openReject}
        />
      </div>

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
