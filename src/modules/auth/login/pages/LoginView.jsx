import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { getSafeRedirectPath } from '@/shared/router/utils/safeRedirect';
import { CONTACT_PATH } from '@/modules/public/contact';
import SuspensionNotice from '../components/SuspensionNotice';
import { Checkbox, FormLabel, Input, PasswordInput } from '@/components/form-controls';

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
              <FormLabel variant="auth" htmlFor="email">
                Email Address
              </FormLabel>
              <Input
                variant="auth"
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuspension(null);
                }}
                placeholder="Enter Your email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <FormLabel variant="auth" htmlFor="password">
                Password
              </FormLabel>
              <PasswordInput
                variant="auth"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((prev) => !prev)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  disabled={loading}
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

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[14px] text-[#64748B]">
          <Mail className="h-4 w-4 text-[#98A2B3]" strokeWidth={2.2} aria-hidden="true" />
          Questions?
          <Link to={CONTACT_PATH} className="font-medium text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginView;
