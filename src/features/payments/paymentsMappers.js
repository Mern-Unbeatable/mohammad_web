import { formatDate } from "@/shared/utils/dates/date";

/** API kind / status → display text and badge tone. */
export const PAYMENT_KIND_LABELS = {
  SUBSCRIPTION: "Membership",
  ADVERTISEMENT: "Advertisement",
  OTHER: "Invoice",
};

export const PAYMENT_STATUS = {
  PAID: { label: "Paid", tone: "success" },
  OPEN: { label: "Due", tone: "warning" },
  FAILED: { label: "Failed", tone: "danger" },
  VOID: { label: "Void", tone: "muted" },
  UNCOLLECTIBLE: { label: "Uncollectible", tone: "danger" },
};

/** Which Stripe link a button opens. */
export const INVOICE_LINK = { VIEW: "view", PDF: "pdf", RECEIPT: "receipt" };

export function formatMoney(amount, currency = "EUR") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-BE", {
      style: "currency",
      currency: String(currency || "EUR").toUpperCase(),
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

const formatPeriod = (start, end) => {
  const from = formatDate(start, { format: "short" });
  const to = formatDate(end, { format: "short" });
  return from && to ? `${from} – ${to}` : "";
};

/** View model for one payment row. */
export function toPaymentModel(payment = {}) {
  const status = PAYMENT_STATUS[payment.status] || { label: payment.status || "—", tone: "muted" };
  const kindLabel = PAYMENT_KIND_LABELS[payment.kind] || PAYMENT_KIND_LABELS.OTHER;

  return {
    id: payment.id,
    kind: payment.kind,
    kindLabel,
    title:
      payment.kind === "ADVERTISEMENT" && payment.advertisement?.title
        ? `Advertisement: ${payment.advertisement.title}`
        : payment.description || kindLabel,
    description: payment.description || "",
    amount: formatMoney(payment.amount, payment.currency),
    date: formatDate(payment.paidAt || payment.issuedAt, { format: "short", fallback: "—" }),
    period: formatPeriod(payment.periodStart, payment.periodEnd),
    invoiceNumber: payment.invoiceNumber || "",
    status: payment.status,
    statusLabel: status.label,
    statusTone: status.tone,
    hasInvoice: Boolean(payment.hasInvoice),
    hasReceipt: Boolean(payment.hasReceipt),
    advertisementId: payment.advertisement?.id || null,
    user: payment.user || null,
  };
}

/** The URL for the requested link, falling back to whatever Stripe has. */
export function pickInvoiceUrl(links = {}, which = INVOICE_LINK.VIEW) {
  if (which === INVOICE_LINK.PDF) return links.invoicePdfUrl || links.hostedInvoiceUrl || null;
  if (which === INVOICE_LINK.RECEIPT) return links.receiptUrl || links.hostedInvoiceUrl || null;
  return links.hostedInvoiceUrl || links.invoicePdfUrl || links.receiptUrl || null;
}
