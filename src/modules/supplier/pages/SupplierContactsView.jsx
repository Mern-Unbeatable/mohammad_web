import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Clock, Handshake, UserCheck, Users } from "lucide-react";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import ContactCard from "@/components/data-display/ContactCard/ContactCard";
import {
  fetchContactsList,
  requestContactConnection,
  acceptConnection,
  clearContactsError,
  invalidateContactsList,
  COUNTRY_OPTIONS,
  toContactCardModel,
} from "@/features/supplier/contacts";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const PROFILE_BASE = "/supplier/contacts";

const DEFAULT_COUNTRY = "All countries";

const FILTER_TABS = [
  {
    id: "people",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Users aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
        People
      </span>
    ),
  },
  {
    id: "pending",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Clock aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
        Pending
      </span>
    ),
  },
  {
    id: "requests",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <UserCheck aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
        Confirm
      </span>
    ),
  },
  {
    id: "connected",
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Handshake aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
        Connected
      </span>
    ),
  },
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

const buildContactsQuery = ({ page, search, country, filter }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: "desc",
  };

  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== DEFAULT_COUNTRY) params.country = country;

  if (filter === "requests") {
    params.status = "pending";
    params.direction = "incoming";
  } else if (filter === "pending") {
    params.status = "pending";
    params.direction = "outgoing";
  } else if (filter === "connected") {
    params.status = "accepted";
  }
  return params;
};

const plural = (total, word) => `${total} ${word}${total === 1 ? "" : "s"}`;

const countLabel = (filter, total) => {
  if (filter === "requests") return `${plural(total, "request")} to confirm`;
  if (filter === "pending") return `${plural(total, "request")} sent`;
  if (filter === "connected") return plural(total, "connection");
  return `${plural(total, "member")} found`;
};

const SupplierContactsView = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    contactsMeta,
    contactsLoading,
    connectingId,
    acceptingId,
    error,
  } = useSelector((state) => state.supplierContacts);

  const [filter, setFilter] = useState("people");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [page, setPage] = useState(1);

  const isRequests = filter === "requests";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateContactsList());
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearContactsError());
    dispatch(
      fetchContactsList(
        buildContactsQuery({
          page,
          search: debouncedQuery,
          country,
          filter,
        }),
      ),
    );
  }, [dispatch, page, debouncedQuery, country, filter]);

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
    contactsMeta?.totalPages || Math.ceil(total / GRID_PAGE_SIZE) || 1,
  );

  const handleFilterChange = (next) => {
    if (next === filter) return;
    dispatch(invalidateContactsList());
    setFilter(next);
    setPage(1);
  };

  const handleCountryChange = (next) => {
    if (next === country) return;
    dispatch(invalidateContactsList());
    setCountry(next);
    setPage(1);
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateContactsList());
    setPage(next);
  };

  const handleConnect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
    }
  };

  const handleAccept = async (connectionId) => {
    if (!connectionId || acceptingId === connectionId) return;

    const result = await dispatch(acceptConnection(connectionId));
    if (acceptConnection.fulfilled.match(result)) {
      toast.success("Connection confirmed");
    }
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Contacts Directory"
        subtitle="Find laboratory professionals, suppliers and companies across the network."
      />

      <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-center lg:justify-between">
        <SegmentedTabs
          tabs={FILTER_TABS}
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
            placeholder="Search by name, laboratory or position..."
            className="w-full min-w-0 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:max-w-[440px] sm:flex-1 lg:max-w-none"
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

      <p className="text-[13px] text-[#64748B]">
        {contactsLoading ? "Loading…" : countLabel(filter, total)}
      </p>

      {contactsLoading ? (
        <CardSkeleton
          variant="contact"
          count={GRID_PAGE_SIZE}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
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
            {(debouncedQuery.trim() || country !== DEFAULT_COUNTRY
              ? FILTERED_EMPTY_MESSAGES
              : EMPTY_MESSAGES)[filter]}
          </p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierContactsView;
