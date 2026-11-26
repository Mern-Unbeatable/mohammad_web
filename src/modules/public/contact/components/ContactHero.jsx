import { Clock3, Mail, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import { COMPANY } from '@/modules/public/about/constant/constants';
import { CONTACT_EMAIL } from '../constant/constants';

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: MapPin,
    label: 'Office',
    value: COMPANY.address,
  },
  {
    icon: Clock3,
    label: 'Hours',
    value: 'Mon–Fri · 9:00–17:00 CET',
  },
];

const ContactHero = () => (
  <section className="relative isolate overflow-hidden border-b border-slate-200/70 bg-slate-50">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
    />
    <Container className="relative py-16 text-center sm:py-20 lg:py-24">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Contact Lab Unity
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-[34px] font-bold leading-[1.15] tracking-[-0.025em] text-deep-blue sm:text-[44px] lg:text-[52px]">
        Get in touch with our team
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-500 sm:text-[17px]">
        Questions about Lab Unity, membership, or partnerships? Send us a message and
        we&apos;ll get back to you.
      </p>

      <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {CHANNELS.map(({ icon: Icon, label, value, href }) => (
          <li
            key={label}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-left shadow-sm backdrop-blur"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
              <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="mt-1 block truncate text-[13.5px] font-medium text-deep-blue hover:text-primary hover:underline"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-1 text-[13.5px] font-medium leading-snug text-deep-blue">
                  {value}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default ContactHero;
