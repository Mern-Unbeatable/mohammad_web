import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { INVOICE_LINK, paymentsApi, pickInvoiceUrl } from '@/features/payments';

/** Start a file download from the current page (Stripe serves the PDF as an attachment). */
function downloadFromCurrentPage(url) {
  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Opens a payment's Stripe invoice page or receipt in a new tab, or downloads
 * its PDF. Links are fetched on click because Stripe-hosted links can expire.
 * For pages, the tab is opened before the request so popup blockers treat it
 * as user-initiated; the PDF needs no tab, since Stripe sends it as a
 * download (a tab would be left blank).
 */
export function useInvoiceOpener() {
  const [openingKey, setOpeningKey] = useState(null);

  const open = useCallback(async (paymentId, which) => {
    const isDownload = which === INVOICE_LINK.PDF;
    const tab = isDownload ? null : window.open('', '_blank');
    setOpeningKey(`${paymentId}:${which}`);
    try {
      const links = await paymentsApi.getPaymentLinks(paymentId);
      const url = pickInvoiceUrl(links, which);
      if (!url) throw new Error('No invoice is available for this payment yet.');

      if (isDownload && links.invoicePdfUrl) {
        downloadFromCurrentPage(url);
      } else if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      tab?.close();
      toast.error(paymentsApi.getApiErrorMessage(err, err?.message || 'Could not open the invoice'));
    } finally {
      setOpeningKey(null);
    }
  }, []);

  return { open, openingKey };
}
