import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { PasswordField, PasswordStrength } from '@/modules/auth/components/AuthFormFields';
import { isStrongPassword } from '@/shared/utils/auth/passwordRules';

/** Reset tokens are 32 random bytes, hex-encoded. */
const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

const PASSWORD_RULES_MESSAGE =
  'Password must have 8+ characters with an uppercase letter, a number and a symbol.';

const primaryButtonClass =
  'flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60';

const BackToSignIn = () => (
  <Link
    to="/login"
    className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
  >
    <ArrowLeft className="h-4 w-4" />
    Back to Sign In
  </Link>
);

const Notice = ({ children }) => (
  <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left">
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">{children}</div>
  </div>
);

const formatExpiry = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const HEADINGS = {
  checking: ['Set a new password', 'Checking your reset link...'],
  valid: ['Set a new password', "Choose a strong password you haven't used before."],
  invalid: [
    'Link invalid or expired',
    'Reset links expire after a short time and can only be used once.',
  ],
  error: ['Set a new password', "We couldn't check your reset link."],
  done: ['Password updated', 'You can now sign in with your new password.'],
};

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token')?.trim() || '';
  const token = urlToken || location.state?.resetToken || '';
  const hasValidFormat = TOKEN_PATTERN.test(token);
  const { verifyResetToken, resetPassword, loading } = useAuth();

  const [check, setCheck] = useState({ token: null, status: 'checking', message: '', expiresAt: null });
  const [retryCount, setRetryCount] = useState(0);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const requestedRef = useRef('');

  // Move the secret out of the address bar (history, screenshots, Referer)
  // into history state, which still survives a page refresh.
  useEffect(() => {
    if (urlToken) {
      navigate('/reset-password', { replace: true, state: { resetToken: urlToken } });
    }
  }, [urlToken, navigate]);

  useEffect(() => {
    const key = `${token}:${retryCount}`;
    if (!hasValidFormat || requestedRef.current === key) return;
    requestedRef.current = key;
    verifyResetToken(token).then((result) => {
      if (result.ok) {
        setCheck({ token, status: 'valid', message: '', expiresAt: result.expiresAt });
      } else if (result.status === 400) {
        setCheck({ token, status: 'invalid', message: result.error, expiresAt: null });
      } else {
        setCheck({ token, status: 'error', message: result.error, expiresAt: null });
      }
    });
  }, [token, hasValidFormat, retryCount, verifyResetToken]);

  let status = 'checking';
  if (done) status = 'done';
  else if (!hasValidFormat) status = 'invalid';
  else if (check.token === token) status = check.status;

  const retryCheck = () => {
    setCheck((prev) => ({ ...prev, token: null }));
    setRetryCount((count) => count + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setFormError('');

    if (!isStrongPassword(password)) {
      setFormError(PASSWORD_RULES_MESSAGE);
      toast.error(PASSWORD_RULES_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    const result = await resetPassword({ token, password, confirmPassword });

    if (result.ok) {
      setDone(true);
      setPassword('');
      setConfirmPassword('');
      navigate('/reset-password', { replace: true, state: null });
      toast.success(result.message || 'Password reset successfully');
      return;
    }

    toast.error(result.error);
    if (result.status === 400) {
      setCheck({ token, status: 'invalid', message: result.error, expiresAt: null });
      return;
    }
    setFormError(result.error);
  };

  const [heading, subheading] = HEADINGS[status];
  const expiry = formatExpiry(check.expiresAt);

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            {heading}
          </h1>
          <p className="mt-1 text-base text-[#64748B]">{subheading}</p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          {status === 'checking' && (
            <div className="flex flex-col items-center gap-3 py-6 text-[14px] text-[#64748B]" role="status">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              Verifying link...
            </div>
          )}

          {status === 'invalid' && (
            <div className="space-y-5">
              <Notice>
                <p>
                  {token
                    ? check.message || 'This password reset link is invalid or has expired.'
                    : 'This password reset link is invalid or incomplete. Open the link from your email again.'}
                </p>
              </Notice>
              <Link to="/forgot-password" className={primaryButtonClass}>
                Request a new reset link
              </Link>
              <BackToSignIn />
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5">
              <Notice>
                <p>{check.message || 'Something went wrong. Please try again.'}</p>
              </Notice>
              <button type="button" onClick={retryCheck} className={primaryButtonClass}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </button>
              <BackToSignIn />
            </div>
          )}

          {status === 'done' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <p className="text-[15px] leading-[1.6] text-[#475467]">
                Your password has been changed and you&apos;ve been signed out of other devices.
              </p>
              <Link to="/login" replace className={primaryButtonClass}>
                Continue to Sign In
              </Link>
            </div>
          )}

          {status === 'valid' && (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {formError && (
                <Notice>
                  <p role="alert">{formError}</p>
                </Notice>
              )}

              <PasswordField
                id="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                autoComplete="new-password"
                disabled={loading}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                autoComplete="new-password"
                disabled={loading}
              />

              <PasswordStrength password={password} />

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </button>

              {expiry && (
                <p className="text-center text-[13px] text-[#98A2B3]">
                  This link is valid until {expiry}.
                </p>
              )}

              <BackToSignIn />
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordView;
