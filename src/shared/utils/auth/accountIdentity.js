/**
 * Display fields for the signed-in user. Auth state stores the raw API user,
 * with name / avatar / initials nested under `profile`.
 */
export function toAccountIdentity(user) {
  const profile = user?.profile || {};
  const name =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "";
  const initials =
    profile.initials ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  return {
    name,
    initials: initials || "",
    avatar: profile.avatar || user?.avatar || null,
  };
}
