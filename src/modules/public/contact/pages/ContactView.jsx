import Container from '@/components/ui/Container';
import ContactHero from '../components/ContactHero';
import ContactForm from '../components/ContactForm';

const ContactView = () => (
  <div className="flex-1">
    <ContactHero />

    <section className="bg-white py-14 lg:py-20">
      <Container className="max-w-[720px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  </div>
);

export default ContactView;
