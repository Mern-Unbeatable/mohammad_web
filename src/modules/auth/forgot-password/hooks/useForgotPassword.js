import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { cooldownEnd, secondsUntil } from '../utils/cooldown';
import { HEADINGS, SENT_SUCCESS_MESSAGE } from '../constant/constants';

/**
 * Forgot-password flow: email form, send the link, then a "check your email"
 * state with a resend button held back by a cooldown.
 */
export const useForgotPassword = () => {
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

  const sendResetLink = async (address) => {
    const result = await forgotPassword(address);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const sentAt = Date.now();
    setNow(sentAt);
    setCooldownUntil(cooldownEnd(sentAt));
    setSentTo(address);
    toast.success(result.message || SENT_SUCCESS_MESSAGE);
  };

  const [heading, subheading] = sentTo ? HEADINGS.sent : HEADINGS.form;

  return {
    heading,
    subheading,
    sentTo,
    form: {
      email,
      loading,
      onEmailChange: (e) => setEmail(e.target.value),
      onSubmit: (e) => {
        e.preventDefault();
        sendResetLink(email.trim());
      },
    },
    sent: {
      email: sentTo,
      loading,
      secondsLeft: secondsUntil(cooldownUntil, now),
      onResend: () => sendResetLink(sentTo),
      onChangeEmail: () => setSentTo(''),
    },
  };
};
