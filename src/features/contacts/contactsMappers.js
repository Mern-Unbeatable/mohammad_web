/** Map connections API contacts onto ContactCard / profile UI props. */

export const COUNTRY_OPTIONS = [
  "All countries",
  "Belgium",
  "France",
  "Germany",
  "Italy",
  "Netherlands",
  "Sweden",
  "United Kingdom",
];

const isConnected = (status) => status === "ACCEPTED";
const isPending = (status) => status === "PENDING";

export function toContactCardModel(contact) {
  if (!contact) return null;

  const name =
    contact.name ||
    [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
    contact.email ||
    "Member";

  const status = contact.connectionStatus;
  const connected = isConnected(status);
  const pending = isPending(status);
  const connectionDirection = contact.connectionDirection || null;
  const incoming = pending && connectionDirection === "incoming";

  return {
    id: contact.id,
    name,
    initials:
      contact.initials ||
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") ||
      "MB",
    title: contact.title || "Lab professional",
    company: contact.company || "—",
    country: contact.country || "—",
    avatar: contact.avatar || null,
    coverPhoto: contact.coverPhoto || null,
    avatarClass: "bg-[#E8F3FB] text-primary",
    connections: contact.connections ?? 0,
    about:
      contact.about ||
      contact.aboutExtended ||
      "No professional summary available.",
    email: connected
      ? contact.email || "—"
      : "Visible to connections",
    phone: connected
      ? contact.phone || "—"
      : "Visible to connections",
    connected,
    pending,
    incoming,
    connectionStatus: status || null,
    connectionDirection,
    connectionId: contact.connectionId || null,
    postIds: [],
    raw: contact,
  };
}

export function toContactProfileModel(contact) {
  return toContactCardModel(contact);
}
