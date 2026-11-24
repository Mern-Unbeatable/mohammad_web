import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchContactsList,
  requestContactConnection,
  acceptConnection,
  clearContactsError,
  invalidateContactsList,
  fetchPendingRequestCount,
  selectPendingRequestCount,
  toContactCardModel,
} from "@/features/dash/supplier/contacts";
import { buildContactsQuery, totalPagesFrom } from "../utils/contactsQuery";
import { emptyMessage, statusLabel } from "../utils/contactsLabels";
import { DEFAULT_COUNTRY, DEFAULT_FILTER, FILTER, SEARCH_DEBOUNCE_MS } from "../constant/constants";

/** Directory: filter tab, country, debounced search and page, plus connect / accept. */
export const useContactsDirectory = () => {
  const dispatch = useDispatch();
  const { contacts, contactsMeta, contactsLoading, connectingId, acceptingId, error } =
    useSelector((state) => state.supplierContacts);
  const pendingRequests = useSelector(selectPendingRequestCount);

  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPendingRequestCount());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateContactsList());
      setDebouncedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  const contactsQuery = useMemo(
    () => buildContactsQuery({ page, search: debouncedQuery, country, filter }),
    [page, debouncedQuery, country, filter],
  );

  const latestQueryRef = useRef(contactsQuery);
  useEffect(() => {
    latestQueryRef.current = contactsQuery;
  }, [contactsQuery]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    dispatch(clearContactsError());
    dispatch(fetchContactsList(contactsQuery));
  }, [dispatch, contactsQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const cards = useMemo(
    () => (contacts || []).map(toContactCardModel).filter(Boolean),
    [contacts],
  );
  const total = contactsMeta?.total || 0;

  const changeFilter = (next) => {
    if (next === filter) return;
    dispatch(invalidateContactsList());
    setFilter(next);
    setPage(1);
  };

  const changeCountry = (next) => {
    if (next === country) return;
    dispatch(invalidateContactsList());
    setCountry(next);
    setPage(1);
  };

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateContactsList());
    setPage(next);
  };

  // The acted-on card is already gone; refetch so the next member fills this page.
  const refreshInBackground = async () => {
    const latest = latestQueryRef.current;
    const result = await dispatch(fetchContactsList({ ...latest, background: true }));
    const lastPage = Number(result.payload?.meta?.totalPages) || 1;
    if (
      fetchContactsList.fulfilled.match(result) &&
      latestQueryRef.current === latest &&
      latest.page > lastPage
    ) {
      setPage(lastPage);
    }
  };

  const connect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
      refreshInBackground();
    }
  };

  const accept = async (connectionId) => {
    if (!connectionId || acceptingId === connectionId) return;

    const result = await dispatch(acceptConnection(connectionId));
    if (acceptConnection.fulfilled.match(result)) {
      toast.success("Connection confirmed");
      refreshInBackground();
    }
  };

  return {
    filter,
    changeFilter,
    pendingRequests,
    query,
    setQuery,
    country,
    changeCountry,
    loading: contactsLoading,
    status: statusLabel({ loading: contactsLoading, filter, total }),
    cards,
    emptyText: emptyMessage({ filter, search: debouncedQuery, country }),
    isRequests: filter === FILTER.REQUESTS,
    connectingId,
    acceptingId,
    connect,
    accept,
    page,
    totalPages: totalPagesFrom(contactsMeta),
    changePage,
  };
};
