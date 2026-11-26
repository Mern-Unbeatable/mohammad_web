import { Building2, Mail, MapPin, ShieldCheck } from 'lucide-react';
import Container from '@/components/ui/Container';
import { CONTACT_EMAIL } from '@/modules/public/contact';
import { COMPANY } from '../constant/constants';

const TRUST_POINTS = [
  'Verified company identity and published legal details',
  'Built for laboratory, healthcare, and supplier professionals',
  'Clear terms, privacy policy, and contact channels',
];

const AboutMission = () => (
  <section className="bg-white py-14 lg:py-20">
    <Container>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who we are
          </span>
          <h2 className="mt-3 text-[26px] font-bold leading-snug tracking-[-0.015em] text-deep-blue sm:text-[30px]">
            A trusted home for the laboratory ecosystem
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-slate-600">
            {COMPANY.brand} is a professional platform for the laboratory and healthcare
            ecosystem. We bring people, organisations, and suppliers together so the industry
            can collaborate with clarity and confidence.
          </p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-slate-600">
            The service is operated by {COMPANY.name}, based in Jumet, Belgium. Visitors and
            search engines can verify who runs the site through our published company details,
            terms, and privacy policy.
          </p>

          <ul className="mt-8 space-y-3">
            {TRUST_POINTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[14.5px] text-slate-600"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 6.5l2.5 2.5 4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <h3 className="text-[15px] font-semibold text-deep-blue">Company details</h3>
          </div>

          <dl className="mt-6 divide-y divide-slate-200/80">
            <div className="pb-4">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                Legal entity
              </dt>
              <dd className="mt-1.5 flex items-start gap-2 text-[14px] font-medium text-deep-blue">
                <Building2
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                {COMPANY.name}
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                Registered address
              </dt>
              <dd className="mt-1.5 flex items-start gap-2 text-[14px] font-medium text-deep-blue">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                {COMPANY.address}
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                Enterprise / VAT
              </dt>
              <dd className="mt-1.5 text-[14px] font-medium text-deep-blue">
                BCE {COMPANY.enterpriseNumber}
                <span className="mx-1.5 text-slate-300">·</span>
                VAT {COMPANY.vat}
              </dd>
            </div>
            <div className="pt-4">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                Contact
              </dt>
              <dd className="mt-1.5 flex items-center gap-2 text-[14px]">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  </section>
);

export default AboutMission;
