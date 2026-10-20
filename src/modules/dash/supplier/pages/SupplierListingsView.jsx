import Card from '@/components/ui/Card';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';

const SupplierListingsView = () => (
  <PanelPage>
    <PanelPageHeader
      title="My Listings"
      subtitle="Create, edit and track your marketplace equipment listings."
    />

    <Card className="p-4 sm:p-5">
      <p className="text-[14px] text-[#64748B]">
        Supplier listing management will be implemented here.
      </p>
    </Card>
  </PanelPage>
);

export default SupplierListingsView;
