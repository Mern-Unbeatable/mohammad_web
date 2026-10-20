/** Map API conversations / messages onto the Messenger UI models. */
import { stripFormatting } from "./messageFormat";
import { formatDate, toDate } from "@/shared/utils/date";

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** 12-hour clock without the space: 9:05AM, 12:00PM. */
const clockTime = (date) =>
  date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s/g, "");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

/** Short relative label for conversation lists: 12:00PM, 1d, 1 week, 3 weeks, 1y. */
export function formatMessageTime(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return "";

  const days = Math.max(
    0,
    Math.round((startOfDay(now) - startOfDay(date)) / MS_PER_DAY),
  );
  if (days === 0) return clockTime(date);
  if (days < 7) return `${days}d`;
  if (days < 365) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  return `${Math.floor(days / 365)}y`;
}

/** Day part of a bubble label: Yesterday, Mon, Sep 3, Sep 3, 2025. */
const bubbleDayLabel = (date, now) => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(date, yesterday)) return "Yesterday";

  const sixDaysAgo = new Date(now);
  sixDaysAgo.setHours(0, 0, 0, 0);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  if (date >= sixDaysAgo) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
};

/** Label under a message bubble: clock time today, otherwise day + time. */
export function formatBubbleTime(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return "";
  if (sameDay(date, now)) return clockTime(date);
  return `${bubbleDayLabel(date, now)} ${clockTime(date)}`;
}

export function attachmentSummary(attachments = []) {
  if (!attachments.length) return "";
  return attachments.length === 1
    ? "Sent an attachment"
    : `Sent ${attachments.length} attachments`;
}

export const isImageAttachment = (attachment) =>
  String(attachment?.mimeType || "").startsWith("image/");

/** Conversation-list preview for a message (mirrors server `previewOf`). */
export function messagePreview(message) {
  if (!message) return "";
  return (
    stripFormatting(message.body) ||
    attachmentSummary(message.attachments) ||
    (message.listing ? "Shared a listing" : "")
  );
}

const LISTING_STATUS_LABEL = { SOLD: "Sold", REMOVED: "No longer listed" };

const priceFormatter = new Intl.NumberFormat("en-BE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/**
 * Listing card shown in the composer and inside messages. Accepts a message's
 * `listing` or a marketplace API listing (same id/title/price/image/status keys).
 */
export function toChatListingModel(listing) {
  if (!listing?.id) return null;
  const price = Number(listing.price);
  const status = listing.status || "ACTIVE";
  return {
    id: listing.id,
    title: listing.title || "Marketplace listing",
    price: Number.isFinite(price) ? priceFormatter.format(price) : "",
    image: listing.image || listing.images?.[0] || null,
    status,
    available: status === "ACTIVE",
    statusLabel: LISTING_STATUS_LABEL[status] || null,
  };
}

export function toConversationModel(
  conversation,
  { onlineUserIds, currentUserId } = {},
) {
  if (!conversation?.id) return null;
  const isOnline = (id) => Boolean(id && onlineUserIds?.has?.(id));
  // A group counts as online when any other member is.
  const online = conversation.isGroup
    ? (conversation.participants || []).some(
        (member) => member?.id !== currentUserId && isOnline(member?.id),
      )
    : isOnline(conversation.otherUserId);

  return {
    id: conversation.id,
    isGroup: Boolean(conversation.isGroup),
    name: conversation.name || "Conversation",
    subtitle: conversation.subtitle || null,
    initials: conversation.initials || "?",
    avatar: conversation.avatar || null,
    preview: stripFormatting(conversation.preview),
    time: formatMessageTime(conversation.time),
    unread: conversation.unreadCount ?? 0,
    otherUserId: conversation.otherUserId || null,
    isAdmin: !conversation.isGroup && conversation.otherUserRole === "ADMIN",
    myRole: conversation.myRole || null,
    participants: Array.isArray(conversation.participants)
      ? conversation.participants
      : [],
    online,
  };
}

/** Date and time under a group activity notice: "Oct 18, 2026 · 11:37". */
export function formatEventTime(value) {
  const date = toDate(value);
  if (!date) return "";
  const day = formatDate(date, { format: "short" });
  return `${day} · ${clockTime(date)}`;
}

/** "Anna", "Anna and Ben", "Anna, Ben and Cara", "Anna, Ben and 3 others" (mirrors the server). */
export function joinNames(names, max = 3) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length <= max) {
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  }
  return `${names.slice(0, max - 1).join(", ")} and ${names.length - (max - 1)} others`;
}

/** `joinNames` over notice parts, keeping each person as its own part so it can be linked. */
function joinNameParts(people, max = 3) {
  if (people.length <= 1) return people;
  const head = people.length <= max ? people.slice(0, -1) : people.slice(0, max - 1);
  const last =
    people.length <= max ? people[people.length - 1] : `${people.length - (max - 1)} others`;
  return [...head.flatMap((person, index) => (index ? [", ", person] : [person])), " and ", last];
}

/**
 * Group activity notice from the viewer's point of view, split into parts: plain strings and
 * `{ text, userId }` for other people's names (the viewer is a plain "You"/"you").
 */
export function systemMessageParts(message, currentUserId) {
  const event = message?.event || {};
  const isViewer = (id) => Boolean(currentUserId) && id === currentUserId;
  const actor = isViewer(message?.senderId)
    ? "You"
    : message?.sender
      ? { text: message.sender, userId: message.senderId || null }
      : "Someone";
  const targets = joinNameParts(
    (event.targetIds || []).map((id, index) => {
      if (isViewer(id)) return "you";
      const name = event.targetNames?.[index];
      return name ? { text: name, userId: id } : "a member";
    }),
  );

  switch (event.action) {
    case "created":
      return targets.length
        ? [actor, ` created the group "${event.name}" and added `, ...targets]
        : [actor, ` created the group "${event.name}"`];
    case "added":
      return [actor, " added ", ...targets];
    case "removed":
      return [actor, " removed ", ...targets];
    case "left":
      return [actor, " left the group"];
    case "renamed":
      return [actor, ` renamed the group to "${event.name}"`];
    default:
      return [message?.body || ""];
  }
}

/** Group activity notice from the viewer's point of view ("You added Anna", "Nayem removed you"). */
export function systemMessageText(message, currentUserId) {
  return systemMessageParts(message, currentUserId)
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("");
}

/**
 * @param {object} message API or realtime message
 * @param {string} [currentUserId]
 */
export function toMessageModel(message, currentUserId) {
  if (!message?.id) return null;
  const isSystem = message.type === "SYSTEM";
  const isMine =
    currentUserId && message.senderId
      ? message.senderId === currentUserId
      : message.from === "me";
  const textParts = isSystem ? systemMessageParts(message, currentUserId) : null;
  const body = isSystem
    ? textParts.map((part) => (typeof part === "string" ? part : part.text)).join("")
    : message.body || "";

  return {
    id: message.id,
    body,
    text: body,
    textParts,
    isSystem,
    eventTime: isSystem ? formatEventTime(message.time) : "",
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    listing: toChatListingModel(message.listing),
    from: isSystem ? "system" : isMine ? "me" : "them",
    senderId: message.senderId || null,
    sender: typeof message.sender === "string" ? message.sender : null,
    senderAvatar: message.senderAvatar || null,
    senderInitials: message.senderInitials || null,
    time: formatBubbleTime(message.time),
    createdAt: message.time || null,
    edited: Boolean(message.editedAt),
  };
}

/**
 * For direct chats: true when the other participant has read up to the
 * caller's latest message.
 */
export function isSeenByOther(conversation, messages, currentUserId) {
  if (!conversation || conversation.isGroup || !currentUserId) return false;
  const lastMine = [...messages].reverse().find((m) => m.senderId === currentUserId);
  if (!lastMine?.createdAt) return false;
  const other = conversation.participants?.find((p) => p.id !== currentUserId);
  const readAt = toDate(other?.lastReadAt);
  const sentAt = toDate(lastMine.createdAt);
  return Boolean(readAt && sentAt && readAt >= sentAt);
}
