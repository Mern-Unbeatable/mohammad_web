import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { CONTACT_PATH } from "@/modules/public/contact";
import { JOIN_PATH } from "@/modules/public/pricing/constant/constants";

const AboutHero = () => (
  <section className="relative isolate overflow-hidden border-b border-slate-200/70 bg-slate-50">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
    />
    <Container className="relative py-16 text-center sm:py-20 lg:py-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        About Lab Unity
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-[34px] font-bold leading-[1.15] tracking-[-0.025em] text-deep-blue sm:text-[44px] lg:text-[52px]">
        The professional network built for the laboratory industry
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-500 sm:text-[17px]">
        Lab Unity connects laboratory professionals, organisations, and
        suppliers so the industry can discover peers, share knowledge, and grow
        a trusted network — with clarity and confidence.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to={JOIN_PATH}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          Join free
          <ArrowRight
            className="h-4 w-4"
            strokeWidth={2.25}
            aria-hidden="true"
          />
        </Link>
        <Link
          to={CONTACT_PATH}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-[14px] font-semibold text-deep-blue shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          Contact us
        </Link>
      </div>
    </Container>
  </section>
);

export default AboutHero;
