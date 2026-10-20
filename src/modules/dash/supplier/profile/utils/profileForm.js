import { IMAGE_FIELD, PROFILE_IMAGE_MIME_TYPES } from "../constant/constants";

/** Country choices, keeping a saved country that is not in the list. */
export const countryOptions = (current, countries) =>
  current && !countries.includes(current) ? [current, ...countries] : countries;

export const isProfileImage = (file) => PROFILE_IMAGE_MIME_TYPES.has(file?.type);

/** First validation message for the profile form, or null when valid. */
export const profileFormError = (form) =>
  !form.firstName?.trim() || !form.lastName?.trim()
    ? "First and last name are required"
    : null;

export const uploadSuccessMessage = (fieldKey) =>
  fieldKey === IMAGE_FIELD.AVATAR ? "Profile photo ready" : "Cover photo ready";
