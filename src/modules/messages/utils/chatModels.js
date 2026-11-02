/** Name of `userId` among `participants`, or `fallback` when unknown. */
export const memberNameFor = (participants, userId, fallback) =>
  participants?.find((member) => member.id === userId)?.name || fallback;

export const typingNamesFor = (participants, typingIds = []) =>
  typingIds.map((userId) => memberNameFor(participants, userId, 'Someone'));

/** Adds `typingNames` to a chat model when someone in it is typing. */
export const withTypingNames = (chat, typingIds = []) => {
  if (typingIds.length === 0) return chat;
  return { ...chat, typingNames: typingNamesFor(chat.participants, typingIds) };
};

/** Raw conversation for `id` from the list, else the separately loaded detail. */
export const findConversation = (conversations, activeDetail, id) =>
  conversations.find((c) => c.id === id) || (activeDetail?.id === id ? activeDetail : null);

/**
 * Stable, sorted, comma-joined ids of every other user whose presence the
 * inbox shows, so presence is only re-queried when that set changes.
 */
export const presenceIdsKey = (conversations, activeRaw, currentUserId) => {
  const ids = new Set();
  conversations.forEach((c) => {
    if (!c.isGroup) {
      if (c.otherUserId) ids.add(c.otherUserId);
      return;
    }
    (c.participants || []).forEach((p) => {
      if (p?.id && p.id !== currentUserId) ids.add(p.id);
    });
  });
  (activeRaw?.participants || []).forEach((p) => {
    if (p.id !== currentUserId) ids.add(p.id);
  });
  return Array.from(ids).sort().join(',');
};

export const hasMorePages = (meta) => (meta?.page ?? 1) < (meta?.totalPages ?? 1);

export const nextPage = (meta) => (meta?.page ?? 1) + 1;
