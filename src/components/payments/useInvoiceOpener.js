import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { paymentsApi, pickInvoiceUrl } from '@/features/payments';

/**
 * Opens a payment's Stripe invoice page, PDF or receipt in a new tab. Links
 * are fetched on click because Stripe-hosted links can expire. The tab is
 * opened before the request so popup blockers treat it as user-initiated.
 */
export function useInvoiceOpener() {
  const [openingKey, setOpeningKey] = useState(null);

  const open = useCallback(async (paymentId, which) => {
    const tab = window.open('', '_blank');
    setOpeningKey(`${paymentId}:${which}`);
    try {
      const links = await paymentsApi.getPaymentLinks(paymentId);
      const url = pickInvoiceUrl(links, which);
      if (!url) throw new Error('No invoice is available for this payment yet.');
      if (tab) {
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
