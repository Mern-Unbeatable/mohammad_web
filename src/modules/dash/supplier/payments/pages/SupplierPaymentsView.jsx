import { useMemo } from "react";
import { CreditCard, Megaphone, Wallet } from "lucide-react";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatCard from "@/components/data-display/StatCard/StatCard";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import { formatMoney } from "@/features/payments";
import { getPaymentColumns } from "../components/paymentColumns";
import { useSupplierPayments } from "../hooks/useSupplierPayments";
import { KIND_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "../constant/constants";

/** Supplier billing: advertising-fee payments with Stripe invoices. */
const SupplierPaymentsView = () => {
  const payments = useSupplierPayments();
  const { openingKey, open } = payments.invoice;

  const columns = useMemo(
    () => getPaymentColumns({ openingKey, onOpen: open }),
    [openingKey, open],
  );

  const summary = payments.summary;
  const stats = [
    {
      id: "collected",
      icon: Wallet,
      tone: "green",
      label: `Collected (${summary?.paidCount ?? 0} paid)`,
      value: formatMoney(summary?.paidTotal ?? 0, summary?.currency),
    },
    {
      id: "ads",
      icon: Megaphone,
      tone: "pink",
      label: "Advertisements",
      value: formatMoney(summary?.advertisementTotal ?? 0, summary?.currency),
    },
    {
      id: "membership",
      icon: CreditCard,
      tone: "blue",
      label: "Memberships",
      value: formatMoney(summary?.subscriptionTotal ?? 0, summary?.currency),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Payments & Invoices"
        subtitle="Your advertising payments. Open or download the Stripe invoice for any payment."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {payments.error ? (
        <p className="rounded-lg border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-[13px] text-[#B42318]">
          {payments.error}
        </p>
      ) : null}

      <DataTable
        compact
        showSearch
        searchValue={payments.search}
        onSearchChange={payments.changeSearch}
        searchPlaceholder="Search by description or invoice number…"
        showFilters
        filterLabel=""
        filters={[
          {
            id: "kind",
            value: payments.kind,
            options: KIND_FILTER_OPTIONS,
            onChange: payments.changeKind,
          },
          {
            id: "status",
            value: payments.status,
            options: STATUS_FILTER_OPTIONS,
            onChange: payments.changeStatus,
          },
        ]}
        columns={columns}
        data={payments.rows}
        loading={payments.loading}
        emptyMessage="No payments yet. Invoices appear here after you pay for an advertisement."
        showPagination
        pagination={payments.pagination}
        tableMinWidth="1040px"
      />
    </PanelPage>
  );
};

export default SupplierPaymentsView;
