import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  formatExpiry,
  isValidTokenFormat,
  readToken,
  resolveStatus,
  toCheck,
  validatePasswords,
} from '../utils/resetPassword';
import {
  HEADINGS,
  RESET_PASSWORD_PATH,
  RESET_STATUS,
  RESET_SUCCESS_MESSAGE,
} from '../constant/constants';

const INITIAL_CHECK = { token: null, status: RESET_STATUS.CHECKING, message: '', expiresAt: null };

/**
 * Reset-password flow: hides the token from the URL, verifies it (with retry),
 * then validates and submits the new password.
 */
export const useResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { urlToken, token } = readToken(searchParams, location.state);
  const hasValidFormat = isValidTokenFormat(token);
  const { verifyResetToken, resetPassword, loading } = useAuth();

  const [check, setCheck] = useState(INITIAL_CHECK);
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
      navigate(RESET_PASSWORD_PATH, { replace: true, state: { resetToken: urlToken } });
    }
  }, [urlToken, navigate]);

  useEffect(() => {
    const key = `${token}:${retryCount}`;
    if (!hasValidFormat || requestedRef.current === key) return;
    requestedRef.current = key;
    verifyResetToken(token).then((result) => setCheck(toCheck(token, result)));
  }, [token, hasValidFormat, retryCount, verifyResetToken]);

  const status = resolveStatus({ done, hasValidFormat, check, token });

  const retryCheck = () => {
    setCheck((prev) => ({ ...prev, token: null }));
    setRetryCount((count) => count + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setFormError('');

    const validationError = validatePasswords(password, confirmPassword);
    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    const result = await resetPassword({ token, password, confirmPassword });

    if (result.ok) {
      setDone(true);
      setPassword('');
      setConfirmPassword('');
      navigate(RESET_PASSWORD_PATH, { replace: true, state: null });
      toast.success(result.message || RESET_SUCCESS_MESSAGE);
      return;
    }

    toast.error(result.error);
    if (result.status === 400) {
      setCheck(toCheck(token, result));
      return;
    }
    setFormError(result.error);
  };

  const [heading, subheading] = HEADINGS[status];

  return {
    status,
    heading,
    subheading,
    hasToken: Boolean(token),
    checkMessage: check.message,
    retryCheck,
    form: {
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      formError,
      loading,
      expiry: formatExpiry(check.expiresAt),
      onPasswordChange: (e) => setPassword(e.target.value),
      onConfirmPasswordChange: (e) => setConfirmPassword(e.target.value),
      togglePassword: () => setShowPassword((prev) => !prev),
      toggleConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
      onSubmit: handleSubmit,
    },
  };
};
