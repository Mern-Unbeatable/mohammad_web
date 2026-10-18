import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AlertCircle, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/auth/useAuth';
import { getSafeRedirectPath } from '@/shared/routing/safeRedirect';
import { inputClass, labelClass } from '@/modules/auth/components/AuthFormFields';
import { CONTACT_SUPPORT_PATH } from '@/shared/constants/support';

const SuspensionNotice = ({ reason, email }) => (
  <div
    role="alert"
    className="mb-6 flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left"
  >
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">
      <p className="font-semibold">Account suspended</p>
      {reason ? (
        <p className="mt-1 whitespace-pre-wrap break-words">
          Your account has been suspended because: {reason}
        </p>
      ) : (
        <p className="mt-1">Your account has been suspended.</p>
      )}
      <p className="mt-1 text-red-600">
        If you think this is a mistake, please contact support.
      </p>
      <Link
        to={CONTACT_SUPPORT_PATH}
        state={{ suspended: true, email, reason }}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
      >
        <Mail className="h-4 w-4" />
        Contact support
      </Link>
    </div>
  </div>
);

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, homePath } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [suspension, setSuspension] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuspension(null);

    const result = await login({
      email,
      password,
      remember: keepSignedIn,
    });

    if (!result.ok) {
      toast.error(result.error || 'Invalid email or password');
      if (result.suspension) setSuspension({ ...result.suspension, email: email.trim() });
      return;
    }

    toast.success('Login successful!');
    const fallback = result.redirectTo || homePath;
    navigate(getSafeRedirectPath(location.state?.from, fallback), { replace: true });
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        {suspension ? (
          <SuspensionNotice reason={suspension.reason} email={suspension.email} />
        ) : null}

        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Welcome back
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            Sign in to continue to your professional network.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuspension(null);
                }}
                className={inputClass}
                placeholder="Enter Your email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#64748B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>


            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary/20"
                />
                <span className="text-[14px] text-[#475467]">Keep me signed in</span>
              </label>
              <Link
                to="/forgot-password"
                state={email ? { email } : undefined}
                className="text-[14px] font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginView;
