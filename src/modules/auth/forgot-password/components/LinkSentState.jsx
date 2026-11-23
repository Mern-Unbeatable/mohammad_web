import { Link } from 'react-router';
import { MailCheck } from 'lucide-react';
import { resendLabel } from '../utils/cooldown';
import { LOGIN_PATH } from '../constant/constants';

/** "Check your email" confirmation with resend (after cooldown) and change-email. */
const LinkSentState = ({ email, loading, secondsLeft, onResend, onChangeEmail }) => (
  <div className="space-y-5 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
      <MailCheck className="h-7 w-7 text-primary" />
    </div>
    <p className="text-[15px] leading-[1.6] text-[#475467]">
      If an account exists for{' '}
      <span className="font-semibold text-deep-blue">{email}</span>, a password
      reset link is on its way. For security, the link is only valid for a short time.
    </p>

    <Link
      to={LOGIN_PATH}
      className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
    >
      Back to Sign In
    </Link>

    <p className="text-[14px] text-[#64748B]">
      Didn&apos;t receive it? Check your spam folder or{' '}
      <button
        type="button"
        onClick={onResend}
        disabled={loading || secondsLeft > 0}
        className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline"
      >
        {resendLabel({ loading, secondsLeft })}
      </button>
      .
    </p>
    <button
      type="button"
      onClick={onChangeEmail}
      disabled={loading}
      className="text-[14px] font-medium text-[#475467] hover:text-deep-blue hover:underline"
    >
      Use a different email
    </button>
  </div>
);

export default LinkSentState;
