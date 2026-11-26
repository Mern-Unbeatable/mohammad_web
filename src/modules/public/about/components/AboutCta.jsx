import { Link } from "react-router";
import { ArrowRight, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import { CONTACT_PATH } from "@/modules/public/contact";
import { JOIN_PATH } from "@/modules/public/pricing/constant/constants";

const AboutCta = () => (
  <section className="bg-white py-14 lg:py-20">
    <Container>
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-700 via-slate-900 to-slate-800 shadow-xl">
        {/* Decorative concentric rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative grid grid-cols-1 gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12">
          {/* Left: message + actions */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-slate-300 backdrop-blur">
              <Sparkles
                className="h-3 w-3 text-primary"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              Let&rsquo;s talk
            </span>

            <h2 className="mt-4 text-[24px] font-bold leading-tight tracking-[-0.015em] text-white sm:text-[28px]">
              Questions or partnership ideas?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-300 lg:mx-0">
              Reach out through our contact page, or create a free account to
              explore the network and see who&rsquo;s already here.
            </p>

            {/* Benefit micro-list */}
            <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left text-[13.5px] text-slate-300 lg:mx-0">
              {[
                "Free to join — no credit card required",
                "Direct line to the Lab Unity team",
                "Reply within 1–2 business days",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                to={JOIN_PATH}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-[14px] font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Join free
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </Link>
              <Link
                to={CONTACT_PATH}
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-[14px] font-semibold text-white backdrop-blur transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Right: support micro-card */}
          <div className="relative">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
                  <Mail
                    className="h-[18px] w-[18px]"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    Talk to a human
                  </p>
                  <p className="text-[12.5px] text-slate-400">
                    Mon–Fri · 9:00–17:00 CET
                  </p>
                </div>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <ul className="space-y-2.5 text-[13px] text-slate-300">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Partnerships</span>
                  <span className="font-medium text-white">
                    hello@labunity.eu
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Support</span>
                  <span className="font-medium text-white">
                    support@labunity.eu
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Press</span>
                  <span className="font-medium text-white">
                    press@labunity.eu
                  </span>
                </li>
              </ul>

              <Link
                to={CONTACT_PATH}
                className="group mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                See all contact options
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default AboutCta;
