export const RESET_PASSWORD_PATH = '/reset-password';
export const LOGIN_PATH = '/login';
export const FORGOT_PASSWORD_PATH = '/forgot-password';

/** Reset tokens are 32 random bytes, hex-encoded. */
export const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

export const RESET_STATUS = {
  CHECKING: 'checking',
  VALID: 'valid',
  INVALID: 'invalid',
  ERROR: 'error',
  DONE: 'done',
};

export const PASSWORD_RULES_MESSAGE =
  'Password must have 8+ characters with an uppercase letter, a number and a symbol.';
export const PASSWORD_MISMATCH_MESSAGE = 'Passwords do not match.';
export const RESET_SUCCESS_MESSAGE = 'Password reset successfully';

export const INVALID_LINK_MESSAGE = 'This password reset link is invalid or has expired.';
export const MISSING_LINK_MESSAGE =
  'This password reset link is invalid or incomplete. Open the link from your email again.';
export const CHECK_FAILED_MESSAGE = 'Something went wrong. Please try again.';

/** Status → [heading, subheading]. */
export const HEADINGS = {
  checking: ['Set a new password', 'Checking your reset link...'],
  valid: ['Set a new password', "Choose a strong password you haven't used before."],
  invalid: [
    'Link invalid or expired',
    'Reset links expire after a short time and can only be used once.',
  ],
  error: ['Set a new password', "We couldn't check your reset link."],
  done: ['Password updated', 'You can now sign in with your new password.'],
};

export const PRIMARY_BUTTON_CLASS =
  'flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60';
