import { Mail } from 'lucide-react';
import Container from '@/components/ui/Container';
import { CONTACT_EMAIL } from '../constant/constants';

const ContactView = () => (
  <section className="flex-1 bg-gradient-to-br from-secondary via-white to-pink-secondary/60 py-14 lg:py-20">
    <Container className="max-w-[640px]">
      <div className="text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
          Contact Us
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">
          Questions about Lab Unity? We&apos;re happy to help.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(16,24,40,0.06)] sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-5 w-5 text-primary" strokeWidth={2.2} />
        </span>
        <p className="mt-4 text-[15px] leading-[1.7] text-[#475467]">
          For more information, please contact us at:
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-1 text-[18px] font-semibold text-primary hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-[#0767AD]"
        >
          <Mail className="h-4 w-4" strokeWidth={2.25} />
          Send us an email
        </a>
      </div>
    </Container>
  </section>
);

export default ContactView;
