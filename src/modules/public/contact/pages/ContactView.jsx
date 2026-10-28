import { Mail } from 'lucide-react';
import Container from '@/components/ui/Container';
import ContactForm from '../components/ContactForm';
import { CONTACT_EMAIL } from '../constant/constants';

const ContactView = () => (
  <section className="flex-1 bg-gradient-to-br from-secondary via-white to-pink-secondary/60 py-14 lg:py-20">
    <Container className="max-w-[720px]">
      <div className="text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
          Contact Us
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">
          Questions about Lab Unity? Send us a message and we&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] sm:p-8">
        <ContactForm />
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[14px] text-[#64748B]">
        <Mail className="h-4 w-4 shrink-0 text-[#98A2B3]" strokeWidth={2.2} />
        <span>
          For more information, please contact us at:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </span>
      </p>
    </Container>
  </section>
);

export default ContactView;
