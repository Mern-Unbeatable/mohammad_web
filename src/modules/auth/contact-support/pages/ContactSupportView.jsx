import { Mail } from 'lucide-react';
import BackToSignIn from '@/modules/auth/components/BackToSignIn';
import SuspensionDetails from '../components/SuspensionDetails';
import SupportEmailCard from '../components/SupportEmailCard';
import SupportChecklist from '../components/SupportChecklist';
import { useContactSupport } from '../hooks/useContactSupport';

const ContactSupportView = () => {
  const {
    isSuspension,
    accountEmail,
    reason,
    subtitle,
    supportEmail,
    mailtoHref,
    copied,
    copyEmail,
  } = useContactSupport();

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Contact support
          </h1>
          <p className="mt-1 text-base text-[#64748B]">{subtitle}</p>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 sm:p-8">
          {isSuspension ? <SuspensionDetails accountEmail={accountEmail} reason={reason} /> : null}

          <SupportEmailCard email={supportEmail} copied={copied} onCopy={copyEmail} />

          <SupportChecklist isSuspension={isSuspension} />

          <a
            href={mailtoHref}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Email support
          </a>

          <BackToSignIn />
        </div>
      </div>
    </section>
  );
};

export default ContactSupportView;
