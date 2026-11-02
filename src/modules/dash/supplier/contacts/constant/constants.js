import { Clock, Handshake, UserCheck, Users } from "lucide-react";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

export const CONTACTS_PATH = "/supplier/contacts";
export const contactProfilePath = (id) => `${CONTACTS_PATH}/${id}`;

/** `pending` = requests I sent; `requests` = requests to me (Confirm tab). */
export const FILTER = {
  PEOPLE: "people",
  CONNECTED: "connected",
  PENDING: "pending",
  REQUESTS: "requests",
};
export const DEFAULT_FILTER = FILTER.PEOPLE;
export const DEFAULT_COUNTRY = "All countries";

export const CONTACTS_PAGE_SIZE = GRID_PAGE_SIZE;
export const CONTACTS_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
export const SEARCH_DEBOUNCE_MS = 350;

export const FILTER_TABS = [
  { id: FILTER.PEOPLE, label: "People", Icon: Users },
  { id: FILTER.PENDING, label: "Pending", Icon: Clock },
  { id: FILTER.REQUESTS, label: "Confirm", Icon: UserCheck },
  { id: FILTER.CONNECTED, label: "Connected", Icon: Handshake },
];

export const EMPTY_MESSAGES = {
  [FILTER.PEOPLE]: "No members match your search.",
  [FILTER.CONNECTED]: "You have no connections yet.",
  [FILTER.PENDING]: "You have no pending sent requests.",
  [FILTER.REQUESTS]: "No requests waiting for you to confirm.",
};

/** Used when a search or country narrows the list. */
export const FILTERED_EMPTY_MESSAGES = {
  ...EMPTY_MESSAGES,
  [FILTER.CONNECTED]: "No connections match your search.",
  [FILTER.PENDING]: "No sent requests match your search.",
  [FILTER.REQUESTS]: "No requests match your search.",
};
