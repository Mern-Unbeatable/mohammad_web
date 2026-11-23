import { useState } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-hot-toast';
import { SUPPORT_CONTACT } from '@/shared/constants/support';
import { buildMailto, readSupportState } from '../utils/supportMail';
import {
  COPIED_RESET_MS,
  COPY_FAILED_MESSAGE,
  COPY_SUCCESS_MESSAGE,
  SUBTITLES,
} from '../constant/constants';

/** Suspension context from history state, the prefilled mailto and copy-to-clipboard. */
export const useContactSupport = () => {
  const { state } = useLocation();
  const { accountEmail, reason, isSuspension } = readSupportState(state);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_CONTACT.email);
      setCopied(true);
      toast.success(COPY_SUCCESS_MESSAGE);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      toast.error(COPY_FAILED_MESSAGE);
    }
  };

  return {
    isSuspension,
    accountEmail,
    reason,
    subtitle: isSuspension ? SUBTITLES.suspension : SUBTITLES.general,
    supportEmail: SUPPORT_CONTACT.email,
    mailtoHref: buildMailto({ email: isSuspension ? accountEmail : '', reason }),
    copied,
    copyEmail,
  };
};
