/** Within this many pixels of the bottom, the reader counts as "following" the chat. */
export const NEAR_BOTTOM_PX = 120;

export const isNearBottom = (el, threshold = NEAR_BOTTOM_PX) =>
  el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

/**
 * Messages added at the end since the `prev` snapshot of the same chat.
 * Prepended (older) pages, edits and deletions add nothing.
 */
export function appendedSince(prev, messages, chatId) {
  const lastId = messages[messages.length - 1]?.id ?? null;
  if (prev.chatId !== chatId || prev.lastId === null || prev.lastId === lastId) return [];
  const prevIndex = messages.findIndex((m) => m.id === prev.lastId);
  if (prevIndex >= 0) return messages.slice(prevIndex + 1);
  // The previous last message is gone (deleted, or replaced by its server copy).
  const added = messages.length - (prev.count ?? messages.length);
  return added > 0 ? messages.slice(-added) : [];
}

/**
 * Decides how the thread reacts to a change in its message list.
 *
 * - `bottom`: a different chat opened, or the reader was following along / sent the message.
 * - `keep-older`: older messages were prepended; keep the visible ones in place.
 * - `indicate`: new messages from others arrived while the reader was scrolled up.
 * - `none`: nothing that affects position (edits, deletions, read receipts).
 *
 * `prev` is the snapshot taken after the last render, `wasNearBottom` is the
 * reader's position *before* the new content was laid out.
 */
export function threadScrollAction(prev, messages, chatId, { wasNearBottom }) {
  const firstId = messages[0]?.id ?? null;
  const lastId = messages[messages.length - 1]?.id ?? null;

  if (prev.chatId !== chatId || prev.lastId === null) return { type: "bottom", unseen: 0 };
  if (prev.lastId === lastId) {
    return prev.firstId !== firstId ? { type: "keep-older", unseen: 0 } : { type: "none", unseen: 0 };
  }

  const appended = appendedSince(prev, messages, chatId);
  if (appended.length === 0) return { type: "none", unseen: 0 };
  if (wasNearBottom || appended.some((m) => m.from === "me")) return { type: "bottom", unseen: 0 };

  const unseen = appended.filter((m) => m.from === "them").length;
  return unseen > 0 ? { type: "indicate", unseen } : { type: "none", unseen: 0 };
}

/**
 * Short screen-reader announcement for messages others just sent in the open
 * chat (never for initial loads, older pages or the reader's own messages).
 */
export function arrivalAnnouncement(prev, messages, chatId) {
  const incoming = appendedSince(prev, messages, chatId).filter((m) => m.from === "them");
  if (incoming.length === 0) return "";
  if (incoming.length > 1) return `${incoming.length} new messages`;
  const sender = incoming[0].sender;
  return sender ? `New message from ${sender}` : "New message";
}

export const newMessagesLabel = (count) =>
  count === 1 ? "1 new message" : `${count} new messages`;
