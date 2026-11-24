import { useEffect, useMemo, useState } from 'react';
import { paymentsApi, toPaymentModel } from '@/features/payments';

/**
 * Paged payment history. `fetcher` is `paymentsApi.getMyPayments` (own
 * history) or `paymentsApi.getAdminPayments` (admin); `params` are extra
 * query filters. Loading is derived from the request key, so the effect only
 * sets state once a response arrives.
 */
export function usePaymentHistory({
  fetcher = paymentsApi.getMyPayments,
  params = {},
  pageSize = 5,
} = {}) {
  const paramsKey = JSON.stringify(params);
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  // New filters start again at page 1.
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (lastParamsKey !== paramsKey) {
    setLastParamsKey(paramsKey);
    setPage(1);
  }

  const requestKey = `${paramsKey}|${page}|${pageSize}|${reloadToken}`;
  const [result, setResult] = useState({ key: null, items: [], meta: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetcher({ ...JSON.parse(paramsKey), page, pageSize })
      .then(({ items, meta }) => {
        if (!cancelled) setResult({ key: requestKey, items, meta, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setResult((prev) => ({
          ...prev,
          key: requestKey,
          error: paymentsApi.getApiErrorMessage(err, 'Failed to load payment history'),
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, paramsKey, page, pageSize, requestKey]);

  const items = useMemo(() => result.items.map(toPaymentModel), [result.items]);

  return {
    items,
    loading: result.key !== requestKey,
    error: result.error,
    page,
    setPage,
    total: result.meta?.total ?? 0,
    totalPages: result.meta?.totalPages ?? 1,
    summary: result.meta?.summary ?? null,
    reload: () => setReloadToken((token) => token + 1),
  };
}
