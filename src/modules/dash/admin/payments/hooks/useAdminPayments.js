import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useInvoiceOpener, usePaymentHistory } from '@/components/payments';
import { paymentsApi } from '@/features/payments';
import { ALL, MESSAGES, PAYMENTS_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../constant/constants';

/** Admin payments list: debounced search, type / status filters, paging, Stripe sync. */
export const useAdminPayments = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [kind, setKind] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const history = usePaymentHistory({
    fetcher: paymentsApi.getAdminPayments,
    params: {
      search: debouncedSearch || undefined,
      kind: kind === ALL ? undefined : kind,
      status: status === ALL ? undefined : status,
    },
    pageSize: PAYMENTS_PAGE_SIZE,
  });
  const invoice = useInvoiceOpener();

  const syncFromStripe = async () => {
    setSyncing(true);
    try {
      const result = await paymentsApi.syncAllPayments();
      toast.success(MESSAGES.SYNCED(result));
      history.reload();
    } catch (err) {
      toast.error(paymentsApi.getApiErrorMessage(err, MESSAGES.SYNC_FAILED));
    } finally {
      setSyncing(false);
    }
  };

  return {
    rows: history.items,
    loading: history.loading,
    error: history.error,
    summary: history.summary,
    total: history.total,
    search,
    changeSearch: setSearch,
    kind,
    changeKind: setKind,
    status,
    changeStatus: setStatus,
    pagination: {
      page: history.page,
      pageSize: PAYMENTS_PAGE_SIZE,
      total: history.total,
      onPageChange: history.setPage,
    },
    invoice,
    syncing,
    syncFromStripe,
  };
};
