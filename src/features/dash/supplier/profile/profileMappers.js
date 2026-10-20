/**
 * Map API user ↔ ProfileSetupForm shape.
 */

export const emptyProfileForm = {
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  country: "Belgium",
  email: "",
  phone: "",
  about: "",
  avatarUrl: "",
  coverUrl: "",
};

export function mapUserToForm(user) {
  const profile = user?.profile || {};
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    title: profile.title || "",
    company: profile.company || "",
    country: profile.country || "Belgium",
    email: user?.email || "",
    phone: profile.phone || "",
    about: profile.about || profile.aboutExtended || "",
    avatarUrl: profile.avatar || "",
    coverUrl: profile.coverPhoto || "",
  };
}

/**
 * Build PATCH /users/me body from form values (email is not updatable here).
 */
export function formToUpdatePayload(form) {
  const payload = {};
  if (form.firstName?.trim()) payload.firstName = form.firstName.trim();
  if (form.lastName?.trim()) payload.lastName = form.lastName.trim();
  if (form.title != null) payload.title = String(form.title).trim();
  if (form.company != null) payload.company = String(form.company).trim();
  if (form.country != null) payload.country = String(form.country).trim();
  if (form.phone != null) payload.phone = String(form.phone).trim();
  if (form.about != null) {
    payload.about = String(form.about).trim();
    payload.aboutExtended = "";
  }
  if (form.avatarUrl) payload.avatarUrl = String(form.avatarUrl).trim();
  if (form.coverUrl) payload.coverUrl = String(form.coverUrl).trim();
  return payload;
}
