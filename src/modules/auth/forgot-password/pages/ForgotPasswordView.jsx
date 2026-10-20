import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { inputClass, labelClass } from '@/modules/auth/components/AuthFormFields';

/** Matches the server's per-account cooldown between reset emails. */
const RESEND_COOLDOWN_SECONDS = 60;

const ForgotPasswordView = () => {
  const location = useLocation();
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [sentTo, setSentTo] = useState('');
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) return undefined;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= cooldownUntil) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);

  const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

  const sendResetLink = async (address) => {
    const result = await forgotPassword(address);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const sentAt = Date.now();
    setNow(sentAt);
    setCooldownUntil(sentAt + RESEND_COOLDOWN_SECONDS * 1000);
    setSentTo(address);
    toast.success(result.message || 'Password reset link sent');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetLink(email.trim());
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            {sentTo ? 'Check your email' : 'Forgot password?'}
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            {sentTo
              ? 'Follow the link in the email to choose a new password.'
              : "Enter your account email and we'll send you a reset link."}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          {sentTo ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-7 w-7 text-primary" />
              </div>
              <p className="text-[15px] leading-[1.6] text-[#475467]">
                If an account exists for{' '}
                <span className="font-semibold text-deep-blue">{sentTo}</span>, a password
                reset link is on its way. For security, the link is only valid for a short time.
              </p>

              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Back to Sign In
              </Link>

              <p className="text-[14px] text-[#64748B]">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => sendResetLink(sentTo)}
                  disabled={loading || secondsLeft > 0}
                  className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline"
                >
                  {loading
                    ? 'Sending...'
                    : secondsLeft > 0
                      ? `resend the link in ${secondsLeft}s`
                      : 'resend the link'}
                </button>
                .
              </p>
              <button
                type="button"
                onClick={() => setSentTo('')}
                disabled={loading}
                className="text-[14px] font-medium text-[#475467] hover:text-deep-blue hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter Your email"
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordView;
