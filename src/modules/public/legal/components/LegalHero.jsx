import Container from '@/components/ui/Container';
import { LEGAL_LAST_UPDATED } from '../constant/constants';

/** Full-bleed hero for Terms / Privacy pages. */
const LegalHero = ({ badge = 'Legal', title, intro }) => (
  <section className="relative isolate overflow-hidden border-b border-slate-200/70 bg-slate-50">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
    />
    <Container className="relative py-16 text-center sm:py-20 lg:py-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {badge}
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-[34px] font-bold leading-[1.15] tracking-[-0.025em] text-deep-blue sm:text-[44px] lg:text-[52px]">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-500 sm:text-[17px]">
        {intro}
      </p>
      <p className="mt-5 text-[13px] text-slate-400">
        Last updated: {LEGAL_LAST_UPDATED}
      </p>
    </Container>
  </section>
);

export default LegalHero;
