/**
 * Query for the page before the oldest loaded message. `beforeId` makes the
 * server's (createdAt, id) cursor exact, so messages sharing a timestamp are
 * neither skipped nor repeated.
 */
export const olderMessagesParams = (messages = []) => {
  const oldest = messages[0];
  return oldest ? { before: oldest.time, beforeId: oldest.id } : {};
};

/**
 * Query for the next conversation page. The server's `nextCursor` keeps pages
 * stable while conversations reorder; `page` stays for older servers.
 */
export const nextConversationsParams = (meta) => ({
  page: (meta?.page ?? 1) + 1,
  ...(meta?.nextCursor ? { cursor: meta.nextCursor } : {}),
});
