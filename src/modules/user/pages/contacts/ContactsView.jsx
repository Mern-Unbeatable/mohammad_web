import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { Clock, Handshake, UserCheck, Users } from "lucide-react";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import Container from "@/components/ui/Container";
import ContactCard from "@/components/data-display/ContactCard/ContactCard";
import {
  fetchContactsList,
  requestContactConnection,
  acceptConnection,
  clearContactsError,
  invalidateContactsList,
  selectPendingRequestCount,
  COUNTRY_OPTIONS,
  toContactCardModel,
} from "@/features/user/contacts";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import CountBadge from "@/components/ui/CountBadge";
import { usePageParam } from "@/shared/hooks/usePageParam";
import {
  COUNTRY_PARAM,
  DEFAULT_COUNTRY,
  FILTER_PARAM,
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  applyFilterChanges,
  buildContactsQuery,
  parseCountryParam,
  parseFilterParam,
  parseSearchParam,
  withoutInvalidFilters,
} from "./contactsUrlFilters";

const PROFILE_BASE = "/contacts";
/** Three full rows on the four-column desktop grid. */
const PAGE_SIZE = 12;

const FILTER_TABS = [
  { id: "people", label: "People", icon: Users },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "requests", label: "Confirm", icon: UserCheck },
  { id: "connected", label: "Connected", icon: Handshake },
];

const EMPTY_MESSAGES = {
  people: "No members match your search.",
  connected: "You have no connections yet.",
  pending: "You have no pending sent requests.",
  requests: "No requests waiting for you to confirm.",
};

const FILTERED_EMPTY_MESSAGES = {
  ...EMPTY_MESSAGES,
  connected: "No connections match your search.",
  pending: "No sent requests match your search.",
  requests: "No requests match your search.",
};

const plural = (total, word) => `${total} ${word}${total === 1 ? "" : "s"}`;

const countLabel = (filter, total) => {
  if (filter === "requests") return `${plural(total, "request")} to confirm`;
  if (filter === "pending") return `${plural(total, "request")} sent`;
  if (filter === "connected") return plural(total, "connection");
  return `${plural(total, "member")} found`;
};

const ContactsView = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    contactsMeta,
    contactsLoading,
    contactsError,
    connectingId,
    acceptingId,
    error,
  } = useSelector((state) => state.userContacts);
  const pendingRequests = useSelector(selectPendingRequestCount);
  const filterTabs = useMemo(
    () =>
      FILTER_TABS.map((tab) => {
        const Icon = tab.icon;
        return {
          id: tab.id,
          label: (
            <span className="inline-flex items-center gap-1.5">
              <Icon aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
              {tab.label}
              {tab.id === "requests" && pendingRequests > 0 && (
                <CountBadge
                  count={pendingRequests}
                  label={`${plural(pendingRequests, "request")} to confirm`}
                />
              )}
            </span>
          ),
        };
      }),
    [pendingRequests],
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseFilterParam(searchParams.get(FILTER_PARAM));
  const country = parseCountryParam(searchParams.get(COUNTRY_PARAM));
  const search = parseSearchParam(searchParams.get(SEARCH_PARAM));
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const isRequests = filter === "requests";

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
      const nextSearch = query.trim() ? query : "";
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const contactsQuery = useMemo(
    () =>
      buildContactsQuery({
        page,
        search,
        country,
        filter,
        pageSize: PAGE_SIZE,
      }),
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
    contactsMeta?.totalPages || Math.ceil(total / PAGE_SIZE) || 1,
  );
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !contactsLoading &&
    !contactsError &&
    Number(contactsMeta?.page) === page &&
    page > totalPages;
  const showSkeleton = contactsLoading || pageOutOfRange;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const handleFilterChange = (next) => {
    if (next === filter) return;
    updateFilters({ [FILTER_PARAM]: next });
  };

  const handleCountryChange = (next) => {
    if (next === country) return;
    updateFilters({ [COUNTRY_PARAM]: next });
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    setPage(next);
  };

  // The acted-on card is already gone; refetch so the next member fills this page.
  const refreshInBackground = () =>
    dispatch(fetchContactsList({ ...latestQueryRef.current, background: true }));

  const handleConnect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
      refreshInBackground();
    }
  };

  const handleAccept = async (connectionId) => {
    if (!connectionId || acceptingId === connectionId) return;

    const result = await dispatch(acceptConnection(connectionId));
    if (acceptConnection.fulfilled.match(result)) {
      toast.success("Connection confirmed");
      refreshInBackground();
    }
  };

  return (
    <main className="py-6 sm:py-8">
      <Container>
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">
            Contacts Directory
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
            Find laboratory professionals, suppliers and companies across the
            network.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row-reverse lg:items-center lg:justify-between">
          <SegmentedTabs
            tabs={filterTabs}
            activeTab={filter}
            onTabChange={handleFilterChange}
            standalone
            ariaLabel="Filter contacts"
            className="border border-[#E4E7EC]"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-1">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={SEARCH_MAX_LENGTH}
              placeholder="Search by name, laboratory or position..."
              className="w-full min-w-0 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] sm:max-w-[440px] sm:flex-1 lg:max-w-none text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              aria-label="Filter by country"
              className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[180px]"
            >
              {COUNTRY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mb-5 text-[13px] text-[#64748B]">
          {showSkeleton
            ? "Loading…"
            : contactsError
              ? "Contacts unavailable"
              : countLabel(filter, total)}
        </p>

        {showSkeleton ? (
          <CardSkeleton
            variant="contact"
            count={PAGE_SIZE}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
        ) : contactsError ? (
          <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#64748B]">Couldn&apos;t load contacts.</p>
            <button
              type="button"
              onClick={loadContacts}
              className="mt-2 text-[14px] font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : cards.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((contact) => (
              <ContactCard
                key={contact.connectionId || contact.id}
                contact={contact}
                profileBasePath={PROFILE_BASE}
                connected={contact.connected}
                pending={contact.pending || connectingId === contact.id}
                incoming={contact.incoming || isRequests}
                accepting={acceptingId === contact.connectionId}
                onConnect={handleConnect}
                onAccept={handleAccept}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#64748B]">
              {(search.trim() || country !== DEFAULT_COUNTRY
                ? FILTERED_EMPTY_MESSAGES
                : EMPTY_MESSAGES)[filter]}
            </p>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      </Container>
    </main>
  );
};

export default ContactsView;
