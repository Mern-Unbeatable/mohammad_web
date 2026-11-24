import { IMAGE_MIME, MESSAGES } from "../constant/constants";

/** Validation message for a picked avatar, or null when it is usable. */
export const avatarFileError = (file) => (IMAGE_MIME.has(file.type) ? null : MESSAGES.BAD_IMAGE);

/** Validation message for the password form, or null when it can be sent. */
export const passwordError = ({ current, next, confirm }) => {
  if (!current || !next || !confirm) return MESSAGES.PASSWORDS_MISSING;
  if (next !== confirm) return MESSAGES.PASSWORDS_MISMATCH;
  return null;
};

export const toPasswordPayload = ({ current, next, confirm }) => ({
  currentPassword: current,
  newPassword: next,
  confirmPassword: confirm,
});
