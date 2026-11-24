import { useEffect, useState } from "react";
import { useInvoiceOpener, usePaymentHistory } from "@/components/payments";
import { paymentsApi } from "@/features/payments";
import {
  ALL,
  PAYMENTS_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "../constant/constants";

/** Supplier payments: debounced search, type / status filters, paging. */
export const useSupplierPayments = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kind, setKind] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const history = usePaymentHistory({
    fetcher: paymentsApi.getMyPayments,
    params: {
      search: debouncedSearch || undefined,
      kind: kind === ALL ? undefined : kind,
      status: status === ALL ? undefined : status,
    },
    pageSize: PAYMENTS_PAGE_SIZE,
  });
  const invoice = useInvoiceOpener();

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
  };
};
