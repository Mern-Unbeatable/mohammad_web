import { useMemo } from 'react';
import { CreditCard, Loader2, Megaphone, RefreshCw, Wallet } from 'lucide-react';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatCard from '@/components/data-display/StatCard/StatCard';
import PanelPage from '@/components/layout/PanelPage';
import PanelPageHeader from '@/components/layout/PanelPageHeader';
import { panelPrimaryBtn } from '@/components/layout/panelPageTheme';
import { formatMoney } from '@/features/payments';
import { getPaymentColumns } from '../components/paymentColumns';
import { useAdminPayments } from '../hooks/useAdminPayments';
import { KIND_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constant/constants';

const AdminPaymentsView = () => {
  const payments = useAdminPayments();
  const { openingKey, open } = payments.invoice;

  const columns = useMemo(
    () => getPaymentColumns({ openingKey, onOpen: open }),
    [openingKey, open],
  );

  const summary = payments.summary;
  const stats = [
    {
      id: 'collected',
      icon: Wallet,
      tone: 'green',
      label: `Collected (${summary?.paidCount ?? 0} paid)`,
      value: formatMoney(summary?.paidTotal ?? 0, summary?.currency),
    },
    {
      id: 'membership',
      icon: CreditCard,
      tone: 'blue',
      label: 'Memberships',
      value: formatMoney(summary?.subscriptionTotal ?? 0, summary?.currency),
    },
    {
      id: 'ads',
      icon: Megaphone,
      tone: 'pink',
      label: 'Advertisements',
      value: formatMoney(summary?.advertisementTotal ?? 0, summary?.currency),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Payments & Invoices"
        subtitle={`${payments.total} payments from members and suppliers`}
        action={
          <button
            type="button"
            onClick={payments.syncFromStripe}
            disabled={payments.syncing}
            className={`${panelPrimaryBtn} gap-2 disabled:cursor-wait disabled:opacity-70`}
            title="Import every Stripe invoice, including payments made before this page existed"
          >
            {payments.syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync from Stripe
          </button>
        }
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
        showSearch
        searchValue={payments.search}
        onSearchChange={payments.changeSearch}
        searchPlaceholder="Search by member, email, company or invoice number…"
        showFilters
        filterLabel=""
        filters={[
          {
            id: 'kind',
            value: payments.kind,
            options: KIND_FILTER_OPTIONS,
            onChange: payments.changeKind,
          },
          {
            id: 'status',
            value: payments.status,
            options: STATUS_FILTER_OPTIONS,
            onChange: payments.changeStatus,
          },
        ]}
        columns={columns}
        data={payments.rows}
        loading={payments.loading}
        emptyMessage="No payments found for the current filters."
        showPagination
        pagination={payments.pagination}
        tableMinWidth="1100px"
      />
    </PanelPage>
  );
};

export default AdminPaymentsView;
