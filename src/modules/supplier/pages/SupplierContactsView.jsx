import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
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
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const PROFILE_BASE = "/supplier/contacts";

const FILTER_OPTIONS = [
  { id: "people", label: "People" },
  { id: "requests", label: "Requests" },
  { id: "connected", label: "Connected" },
];

const EMPTY_MESSAGES = {
  people: "No members match your search.",
  requests: "No pending connection requests.",
  connected: "You have no connections yet.",
};

const buildContactsQuery = ({ page, search, country, filter }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: "desc",
  };

  if (filter === "requests") {
    params.status = "pending";
    params.direction = "incoming";
    return params;
  }

  if (filter === "connected") {
    params.status = "accepted";
    return params;
  }

  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== "All countries") params.country = country;
  return params;
};

const countLabel = (filter, total) => {
  if (filter === "requests") {
    return `${total} request${total === 1 ? "" : "s"}`;
  }
  if (filter === "connected") {
    return `${total} connection${total === 1 ? "" : "s"}`;
  }
  return `${total} member${total === 1 ? "" : "s"} found`;
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
  const [country, setCountry] = useState("All countries");
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, laboratory or position..."
          className="flex-1 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
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

        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          aria-label="Filter contacts"
          className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[160px]"
        >
          {FILTER_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
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
            {EMPTY_MESSAGES[filter]}
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
