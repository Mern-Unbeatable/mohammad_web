import { Navigate, useParams } from "react-router";
import CreateAdModal from "@/components/modals/supplier/CreateAdModal";
import Card from "@/components/ui/Card";
import { AdvertisementDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import AdHeader from "../components/detail/AdHeader";
import AdBody from "../components/detail/AdBody";
import AdStatusSidebar from "../components/detail/AdStatusSidebar";
import { useSupplierAdDetail } from "../hooks/useSupplierAdDetail";
import { ADS_PATH } from "../constant/constants";

const SupplierAdDetailView = () => {
  const { adId } = useParams();
  const detail = useSupplierAdDetail(adId);
  const { ad } = detail;

  if (detail.status === "notFound") return <Navigate to={ADS_PATH} replace />;

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

        <AdStatusSidebar ad={ad} busy={detail.busy} onAction={detail.runAction} />
      </div>

      <CreateAdModal
        key={detail.createOpen ? detail.resubmitAdId || "renew" : "closed"}
        open={detail.createOpen}
        editAdId={detail.resubmitAdId}
        initialAd={detail.resubmitAd}
        onClose={detail.closeCreate}
        onCreated={detail.handleCreated}
      />
    </PanelPage>
  );
};

export default SupplierAdDetailView;
