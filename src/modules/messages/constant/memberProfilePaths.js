/** Route where each role views another member's profile. */
export const MEMBER_PROFILE_BASE_PATHS = Object.freeze({
  USER: '/contacts',
  SUPPLIER: '/supplier/contacts',
  ADMIN: '/admin/users',
});

/** Another member's profile route for a viewer with `role`, or null when unknown. */
export function memberProfilePath(role, userId) {
  const base = MEMBER_PROFILE_BASE_PATHS[String(role || '').toUpperCase()];
  return base && userId ? `${base}/${encodeURIComponent(userId)}` : null;
}
