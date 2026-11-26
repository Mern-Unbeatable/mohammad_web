import { FlaskConical, Handshake, Users, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { ABOUT_PILLARS } from "../constant/constants";

const PILLAR_ICONS = [Users, FlaskConical, Handshake];

const AboutPillars = () => (
  <section className="relative border-y border-slate-200/70 bg-slate-50 py-14 lg:py-20">
    {/* Soft top glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent"
    />

    <Container className="relative">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Why Lab Unity
        </span>
        <h2 className="mt-3 text-[26px] font-bold leading-snug tracking-[-0.015em] text-deep-blue sm:text-[30px]">
          Why teams trust Lab Unity
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
          Three principles guide how we build the network and serve the
          laboratory community.
        </p>
      </div>

      {/* Cards with connecting rail */}
      <div className="relative mt-10">
        {/* Horizontal connecting line behind cards (desktop only) */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[46px] hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent sm:block"
        />

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {ABOUT_PILLARS.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
            const isLead = index === 0;
            return (
              <article
                key={pillar.title}
                className={[
                  "group relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-lg",
                  isLead
                    ? "border-primary/25 bg-white ring-1 ring-primary/10"
                    : "border-slate-200 bg-white hover:border-slate-300",
                ].join(" ")}
              >
                {/* Number tag */}
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 text-[20px] font-bold tabular-nums text-slate-300 transition-colors group-hover:text-primary/60"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon tile */}
                <span
                  className={[
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ring-1 transition-colors",
                    isLead
                      ? "bg-primary text-white ring-primary/30"
                      : "bg-primary/10 text-primary ring-primary/10 group-hover:bg-primary group-hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <h3 className="mt-5 text-[16.5px] font-semibold text-deep-blue">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
                  {pillar.body}
                </p>

                {/* Hover-reveal detail line */}
                <div className="mt-5 flex items-center gap-1.5 text-[12.5px] font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Learn more
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Container>
  </section>
);

export default AboutPillars;
