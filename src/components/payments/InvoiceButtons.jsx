import { Download, ExternalLink, Loader2, Receipt } from 'lucide-react';
import { INVOICE_LINK } from '@/features/payments';

const buttonClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-deep-blue transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60';

/** Invoice page + PDF for invoiced payments; the card receipt for older ones. */
const InvoiceButtons = ({ payment, openingKey, onOpen }) => {
  const busy = (which) => openingKey === `${payment.id}:${which}`;
  const label = payment.invoiceNumber ? `invoice ${payment.invoiceNumber}` : 'invoice';
  const iconClass = 'h-3.5 w-3.5';
  const icon = (which, idle) =>
    busy(which) ? <Loader2 className={`${iconClass} animate-spin`} /> : idle;

  if (payment.hasInvoice) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={busy(INVOICE_LINK.VIEW)}
          onClick={() => onOpen(payment.id, INVOICE_LINK.VIEW)}
          aria-label={`View ${label}`}
        >
          {icon(INVOICE_LINK.VIEW, <ExternalLink className={iconClass} />)}
          Invoice
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={busy(INVOICE_LINK.PDF)}
          onClick={() => onOpen(payment.id, INVOICE_LINK.PDF)}
          aria-label={`Download ${label} as PDF`}
        >
          {icon(INVOICE_LINK.PDF, <Download className={iconClass} />)}
          PDF
        </button>
      </div>
    );
  }

  if (payment.hasReceipt) {
    return (
      <button
        type="button"
        className={buttonClass}
        disabled={busy(INVOICE_LINK.RECEIPT)}
        onClick={() => onOpen(payment.id, INVOICE_LINK.RECEIPT)}
      >
        {icon(INVOICE_LINK.RECEIPT, <Receipt className={iconClass} />)}
        Receipt
      </button>
    );
  }

  return null;
};

export default InvoiceButtons;
