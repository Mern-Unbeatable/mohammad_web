export const LOGIN_PATH = '/login';

/** Matches the server's per-account cooldown between reset emails. */
export const RESEND_COOLDOWN_SECONDS = 60;

export const SENT_SUCCESS_MESSAGE = 'Password reset link sent';

/** [heading, subheading] before and after the link is sent. */
export const HEADINGS = {
  form: ['Forgot password?', "Enter your account email and we'll send you a reset link."],
  sent: ['Check your email', 'Follow the link in the email to choose a new password.'],
};
