import PanelPage from '@/components/layout/PanelPage';
import PanelPageHeader from '@/components/layout/PanelPageHeader';
import { PaymentHistoryCard } from '@/components/payments';

/** Supplier billing: advertising-fee payments with their Stripe invoices. */
const SupplierPaymentsView = () => (
  <PanelPage>
    <PanelPageHeader
      title="Payments & Invoices"
      subtitle="Your advertising payments. Open or download the Stripe invoice for any payment."
    />

    <PaymentHistoryCard
      title="Payment history"
      subtitle="Newest first."
      emptyMessage="No payments yet. Invoices appear here after you pay for an advertisement."
      pageSize={10}
    />
  </PanelPage>
);

export default SupplierPaymentsView;
