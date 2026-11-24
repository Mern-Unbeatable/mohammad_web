import { SUPPORT_CONTACT } from '@/shared/constants/support';
import { MAIL_SUBJECTS } from '../constant/constants';

/** Suspension details passed in history state by the login page. */
export const readSupportState = (state) => ({
  accountEmail: state?.email || '',
  reason: state?.reason || '',
  isSuspension: Boolean(state?.suspended),
});

/** Prefilled mailto link; with an `email` it is a suspension appeal. */
export const buildMailto = ({ email, reason }) => {
  const subject = email ? MAIL_SUBJECTS.suspension : MAIL_SUBJECTS.general;
  const lines = email
    ? [
        'Hello Lab Unity support,',
        '',
        `My account (${email}) has been suspended.`,
        ...(reason ? [`Reason shown: ${reason}`] : []),
        '',
        'Why I believe this should be reviewed:',
        '',
      ]
    : ['Hello Lab Unity support,', ''];
  const params = new URLSearchParams({ subject, body: lines.join('\n') });
  return `mailto:${SUPPORT_CONTACT.email}?${params.toString().replace(/\+/g, '%20')}`;
};
