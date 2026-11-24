import { ChevronLeft, ChevronRight, CreditCard, FileText, Megaphone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/common/Skeleton';
import InvoiceButtons from './InvoiceButtons';
import PaymentStatusBadge from './PaymentStatusBadge';
import { useInvoiceOpener } from './useInvoiceOpener';
import { usePaymentHistory } from './usePaymentHistory';

const KIND_ICON = { SUBSCRIPTION: CreditCard, ADVERTISEMENT: Megaphone, OTHER: FileText };

function PaymentRow({ payment, compact, openingKey, onOpen }) {
  const Icon = KIND_ICON[payment.kind] || FileText;
  const meta = [payment.date, payment.invoiceNumber].filter(Boolean).join(' · ');

  return (
    <li
      className={`flex flex-col gap-3 px-5 py-4 sm:px-6 ${
        compact ? '' : 'sm:flex-row sm:items-center sm:justify-between'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-deep-blue" title={payment.title}>
            {payment.title}
          </p>
          <p className="mt-0.5 text-[12px] text-[#64748B]">{meta}</p>
          {payment.period ? (
            <p className="mt-0.5 text-[12px] text-[#98A2B3]">Period: {payment.period}</p>
          ) : null}
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-3 ${
          compact ? 'pl-12' : 'pl-12 sm:justify-end sm:pl-0'
        }`}
      >
        <div className="text-left sm:text-right">
          <p className="text-[14px] font-bold text-deep-blue">{payment.amount}</p>
          <PaymentStatusBadge label={payment.statusLabel} tone={payment.statusTone} className="mt-1" />
        </div>
        <InvoiceButtons payment={payment} openingKey={openingKey} onOpen={onOpen} />
      </div>
    </li>
  );
}

function LoadingRows({ count }) {
  return (
    <ul className="divide-y divide-[#E4E7EC]" aria-label="Loading payments">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <Skeleton rounded="full" className="h-9 w-9 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton tone="muted" className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Card listing payments with Stripe invoice / PDF / receipt buttons.
 * Defaults to the signed-in member's own history; pass `fetcher` + `params`
 * for an admin view of one member. `compact` stacks rows for narrow columns.
 */
const PaymentHistoryCard = ({
  title = 'Payment history',
  subtitle = 'Invoices and receipts for your payments.',
  emptyMessage = 'No payments yet.',
  fetcher,
  params,
  pageSize = 5,
  compact = false,
  className = '',
  id,
}) => {
  const history = usePaymentHistory({ fetcher, params, pageSize });
  const { open, openingKey } = useInvoiceOpener();
  const showRows = history.items.length > 0;

  return (
    <Card className={className} id={id}>
      <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-deep-blue">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13px] text-[#64748B]">{subtitle}</p> : null}
      </div>

      {history.error ? (
        <p className="mx-5 mt-4 rounded-lg border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-[13px] text-[#B42318] sm:mx-6">
          {history.error}
        </p>
      ) : null}

      {history.loading && !showRows ? (
        <LoadingRows count={Math.min(pageSize, 3)} />
      ) : showRows ? (
        <ul
          className={`divide-y divide-[#E4E7EC] transition-opacity ${history.loading ? 'opacity-60' : ''}`}
          aria-busy={history.loading || undefined}
        >
          {history.items.map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              compact={compact}
              openingKey={openingKey}
              onOpen={open}
            />
          ))}
        </ul>
      ) : !history.error ? (
        <p className="px-5 py-8 text-center text-[13px] text-[#64748B] sm:px-6">{emptyMessage}</p>
      ) : null}

      {history.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 border-t border-[#E4E7EC] px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => history.setPage(history.page - 1)}
            disabled={history.page <= 1 || history.loading}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Newer
          </button>
          <span className="text-[12px] text-[#64748B]">
            Page {history.page} of {history.totalPages}
          </span>
          <button
            type="button"
            onClick={() => history.setPage(history.page + 1)}
            disabled={history.page >= history.totalPages || history.loading}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB] disabled:opacity-40"
          >
            Older
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </Card>
  );
};

export default PaymentHistoryCard;
