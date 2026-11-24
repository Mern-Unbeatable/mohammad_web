import { CreditCard, FileText, Megaphone } from "lucide-react";
import { InvoiceButtons, PaymentStatusBadge } from "@/components/payments";

const KIND_ICON = {
  SUBSCRIPTION: CreditCard,
  ADVERTISEMENT: Megaphone,
  OTHER: FileText,
};

const KindCell = ({ row }) => {
  const Icon = KIND_ICON[row.kind] || FileText;
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <span className="text-[13px] font-semibold text-deep-blue">{row.kindLabel}</span>
    </div>
  );
};

/** Supplier payments table columns; last column opens Stripe invoices. */
export const getPaymentColumns = ({ openingKey, onOpen }) => [
  { key: "kindLabel", header: "Type", render: (_value, row) => <KindCell row={row} /> },
  {
    key: "title",
    header: "Description",
    wrap: true,
    className: "min-w-[200px] max-w-[320px]",
  },
  { key: "date", header: "Date", className: "font-semibold" },
  { key: "invoiceNumber", header: "Invoice #", render: (value) => value || "—" },
  { key: "amount", header: "Amount", className: "font-semibold" },
  {
    key: "statusLabel",
    header: "Status",
    render: (label, row) => <PaymentStatusBadge label={label} tone={row.statusTone} />,
  },
  {
    key: "id",
    header: "Invoice",
    render: (_id, row) =>
      row.hasInvoice || row.hasReceipt ? (
        <InvoiceButtons payment={row} openingKey={openingKey} onOpen={onOpen} />
      ) : (
        <span className="text-[12px] text-[#98A2B3]">—</span>
      ),
  },
];
