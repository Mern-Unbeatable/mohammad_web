import { toAccountIdentity } from "@/shared/auth/accountIdentity";

/**
 * Map API user → AdminAccountForm shape.
 */
export function mapUserToForm(user) {
  const { name, initials, avatar } = toAccountIdentity(user);
  return {
    name,
    email: user?.email || "",
    displayName: name || "Admin",
    displayEmail: user?.email || "",
    avatar,
    initials,
  };
}

/**
 * Split a full name into firstName / lastName for PATCH /users/me.
 * A single-word name keeps an empty last name instead of repeating the word.
 */
export function nameToProfilePayload(fullName) {
  const [firstName = "", ...rest] = String(fullName || "")
    .trim()
    .split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}
