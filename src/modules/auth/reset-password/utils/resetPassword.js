import { isStrongPassword } from '@/shared/utils/auth/passwordRules';
import { formatTime } from '@/shared/utils/dates/date';
import {
  PASSWORD_MISMATCH_MESSAGE,
  PASSWORD_RULES_MESSAGE,
  RESET_STATUS,
  TOKEN_PATTERN,
} from '../constant/constants';

export const isValidTokenFormat = (token) => TOKEN_PATTERN.test(token);

/** Token from the URL, else from history state (where it is moved after load). */
export const readToken = (searchParams, locationState) => {
  const urlToken = searchParams.get('token')?.trim() || '';
  return { urlToken, token: urlToken || locationState?.resetToken || '' };
};

/** Verify result → check state; a 400 means the link itself is bad. */
export const toCheck = (token, result) => {
  if (result.ok) {
    return { token, status: RESET_STATUS.VALID, message: '', expiresAt: result.expiresAt };
  }
  return {
    token,
    status: result.status === 400 ? RESET_STATUS.INVALID : RESET_STATUS.ERROR,
    message: result.error,
    expiresAt: null,
  };
};

/** Page status: done wins, then a malformed token, then the check for this token. */
export const resolveStatus = ({ done, hasValidFormat, check, token }) => {
  if (done) return RESET_STATUS.DONE;
  if (!hasValidFormat) return RESET_STATUS.INVALID;
  if (check.token === token) return check.status;
  return RESET_STATUS.CHECKING;
};

/** First form error, or "" when the passwords are acceptable. */
export const validatePasswords = (password, confirmPassword) => {
  if (!isStrongPassword(password)) return PASSWORD_RULES_MESSAGE;
  if (password !== confirmPassword) return PASSWORD_MISMATCH_MESSAGE;
  return '';
};

export const formatExpiry = (value) =>
  formatTime(value, { format: { hour: '2-digit', minute: '2-digit' }, locale: [] });
