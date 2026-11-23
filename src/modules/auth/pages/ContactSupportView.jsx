import { Link, useLocation } from 'react-router';
import { ArrowLeft, Check, Copy, Mail, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { SUPPORT_CONTACT } from '@/shared/constants/support';

const buildMailto = ({ email, reason }) => {
  const subject = email ? 'Account suspension appeal' : 'Support request';
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

const ContactSupportView = () => {
  const { state } = useLocation();
  const accountEmail = state?.email || '';
  const reason = state?.reason || '';
  const isSuspension = Boolean(state?.suspended);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_CONTACT.email);
      setCopied(true);
      toast.success('Support email copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the email address');
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Contact support
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            {isSuspension
              ? 'Get in touch with our team about your account suspension.'
              : "We're here to help with your Lab Unity account."}
          </p>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 sm:p-8">
          {isSuspension ? (
            <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">
                <p className="font-semibold">Account suspended</p>
                {accountEmail ? (
                  <p className="mt-1 break-words">Account: {accountEmail}</p>
                ) : null}
                {reason ? (
                  <p className="mt-1 whitespace-pre-wrap break-words">Reason: {reason}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-[#E4E7EC] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[#64748B]">Email</p>
                <a
                  href={`mailto:${SUPPORT_CONTACT.email}`}
                  className="mt-0.5 block break-all text-[15px] font-semibold text-deep-blue hover:text-primary"
                >
                  {SUPPORT_CONTACT.email}
                </a>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy support email"
                className="shrink-0 rounded-md p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4 text-green-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-[14px] leading-[1.6] text-[#475467]">
            <p className="font-semibold text-deep-blue">Please include in your message</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>The email address of your Lab Unity account</li>
              {isSuspension ? (
                <>
                  <li>The suspension reason shown when you tried to sign in</li>
                  <li>Why you think the suspension should be reviewed</li>
                </>
              ) : (
                <li>A short description of what you need help with</li>
              )}
            </ul>
          </div>

          <a
            href={buildMailto({ email: isSuspension ? accountEmail : '', reason })}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Email support
          </a>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSupportView;
