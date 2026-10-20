/** Chat base route per role (mirrors server `messagesPathForRole`). */
export const CHAT_BASE_PATHS = Object.freeze({
  USER: '/chat',
  SUPPLIER: '/supplier/chat',
  ADMIN: '/admin/chat',
});

/**
 * URL sections under a chat base. Direct chats are addressed by the other
 * user's id (`messages/:userId`), groups by conversation id (`group/:groupId`).
 */
export const CHAT_SECTIONS = Object.freeze({
  DIRECT: 'messages',
  GROUP: 'group',
});

export function chatBaseForRole(role) {
  return CHAT_BASE_PATHS[String(role || '').toUpperCase()] || CHAT_BASE_PATHS.USER;
}

/** `{ section, id }` → `/chat/messages/<id>`; omit `id` for the section list. */
export function chatPath(basePath, { section = CHAT_SECTIONS.DIRECT, id } = {}) {
  return id ? `${basePath}/${section}/${encodeURIComponent(id)}` : `${basePath}/${section}`;
}

/** Query param that attaches a marketplace listing to the direct-chat composer. */
export const CHAT_LISTING_PARAM = 'listing';

/** Direct chat with a listing's seller, with the listing preloaded in the composer. */
export function listingChatPath(basePath, sellerId, listingId) {
  const path = chatPath(basePath, { section: CHAT_SECTIONS.DIRECT, id: sellerId });
  return `${path}?${CHAT_LISTING_PARAM}=${encodeURIComponent(listingId)}`;
}

/** Route target for an API conversation; null when a direct chat has no other member left. */
export function chatTargetFor(conversation) {
  if (!conversation?.id) return null;
  if (conversation.isGroup) return { section: CHAT_SECTIONS.GROUP, id: conversation.id };
  if (!conversation.otherUserId) return null;
  return { section: CHAT_SECTIONS.DIRECT, id: conversation.otherUserId };
}

/** Same chat location under another role's base, e.g. `/chat/group/1` → `/admin/chat/group/1`. */
export function toRoleChatPath(pathname, role) {
  const bases = Object.values(CHAT_BASE_PATHS).sort((a, b) => b.length - a.length);
  const base = bases.find((b) => pathname === b || pathname.startsWith(`${b}/`));
  if (!base) return null;
  return `${chatBaseForRole(role)}${pathname.slice(base.length)}`;
}
