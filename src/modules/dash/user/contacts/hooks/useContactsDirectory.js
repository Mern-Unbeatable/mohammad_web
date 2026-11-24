import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  fetchContactsList,
  requestContactConnection,
  acceptConnection,
  clearContactsError,
  invalidateContactsList,
  selectPendingRequestCount,
  toContactCardModel,
} from '@/features/dash/user/contacts';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { SEARCH_PARAM } from '@/shared/utils/urlFilters';
import {
  applyFilterChanges,
  buildContactsQuery,
  readContactsFilters,
  withoutInvalidFilters,
} from '../utils/contactsUrlFilters';
import {
  CONTACTS_PAGE_SIZE,
  COUNTRY_PARAM,
  FILTER,
  FILTER_PARAM,
  SEARCH_DEBOUNCE_MS,
} from '../constant/constants';

/** Directory: filter, country, search and page live in the URL. */
export const useContactsDirectory = () => {
  const dispatch = useDispatch();
  const { contacts, contactsMeta, contactsLoading, contactsError, connectingId, acceptingId, error } =
    useSelector((state) => state.userContacts);
  const pendingRequests = useSelector(selectPendingRequestCount);

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    [FILTER_PARAM]: filter,
    [COUNTRY_PARAM]: country,
    [SEARCH_PARAM]: search,
  } = readContactsFilters(searchParams);
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      dispatch(invalidateContactsList());
      setSearchParams((prev) => applyFilterChanges(prev, changes), { replace });
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    const next = withoutInvalidFilters(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : '';
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const contactsQuery = useMemo(
    () => buildContactsQuery({ page, search, country, filter, pageSize: CONTACTS_PAGE_SIZE }),
    [page, search, country, filter],
  );

  const latestQueryRef = useRef(contactsQuery);
  useEffect(() => {
    latestQueryRef.current = contactsQuery;
  }, [contactsQuery]);

  const loadContacts = useCallback(() => {
    dispatch(clearContactsError());
    dispatch(fetchContactsList(contactsQuery));
  }, [dispatch, contactsQuery]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const cards = useMemo(
    () => (contacts || []).map(toContactCardModel).filter(Boolean),
    [contacts],
  );

  const total = contactsMeta?.total || 0;
  const totalPages = Math.max(
    1,
    contactsMeta?.totalPages || Math.ceil(total / CONTACTS_PAGE_SIZE) || 1,
  );
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !contactsLoading &&
    !contactsError &&
    Number(contactsMeta?.page) === page &&
    page > totalPages;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const changeFilter = (next) => {
    if (next === filter) return;
    updateFilters({ [FILTER_PARAM]: next });
  };

  const changeCountry = (next) => {
    if (next === country) return;
    updateFilters({ [COUNTRY_PARAM]: next });
  };

  const changePage = (next) => {
    if (next === page) return;
    setPage(next);
  };

  // The acted-on card is already gone; refetch so the next member fills this page.
  const refreshInBackground = () =>
    dispatch(fetchContactsList({ ...latestQueryRef.current, background: true }));

  const connect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
      refreshInBackground();
    }
  };

  const accept = async (connectionId) => {
    if (!connectionId || acceptingId === connectionId) return;

    const result = await dispatch(acceptConnection(connectionId));
    if (acceptConnection.fulfilled.match(result)) {
      toast.success('Connection confirmed');
      refreshInBackground();
    }
  };

  return {
    filter,
    changeFilter,
    country,
    changeCountry,
    search,
    query,
    setQuery,
    pendingRequests,
    page,
    totalPages,
    changePage,
    total,
    cards,
    loading: contactsLoading || pageOutOfRange,
    error: contactsError,
    retry: loadContacts,
    isRequests: filter === FILTER.REQUESTS,
    connectingId,
    acceptingId,
    connect,
    accept,
  };
};
