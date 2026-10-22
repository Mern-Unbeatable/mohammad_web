import { Link } from "react-router";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  ShoppingBag,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { FadeUp } from "@/shared/motion/LandingMotion";
import { useHomeCta } from "../../hooks/useHomeCta";
import { CONNECT_AVATARS, LOGIN_PATH } from "../../constant/constants";

const CTA_LABELS = {
  feed: "Go to feed",
  dashboard: "Go to Dashboard",
  join: "Create your free account",
};

const TRUST_POINTS = [
  "Free registration",
  "Ready in 2 minutes",
  "No payment details",
];

const BENEFITS = [
  { icon: Users, label: "Verified professional network" },
  { icon: ShoppingBag, label: "Laboratory marketplace" },
  { icon: Briefcase, label: "Jobs & recruitment" },
  { icon: CalendarDays, label: "Events & industry knowledge" },
];

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium leading-none transition-colors xl:px-8 xl:py-3.5 xl:text-[16px]";

const CtaSection = () => {
  const cta = useHomeCta();

  return (
    <section className="relative overflow-hidden bg-deep-blue py-16 lg:py-20 xl:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-pink-light/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 xl:gap-16">
          <FadeUp className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 xl:text-[12px]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-primary" />
              {cta.isMember ? "Welcome back" : "Free to join"}
            </p>

            <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[32px] lg:mt-5 lg:text-[34px] xl:text-[42px] xl:leading-[1.12]">
              {cta.isMember ? "Continue With Your" : "Join the Laboratory"}{" "}
              <span className="text-[#4FA9EC]">Professional Network</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.7] text-white/70 lg:mx-0 lg:mt-5 xl:text-[16px]">
              {cta.isMember
                ? "Pick up where you left off — your connections, conversations and opportunities are waiting."
                : "Connect with laboratories, researchers and suppliers in one trusted professional environment."}
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-8 lg:justify-start">
              <Link
                to={cta.to}
                className={`${buttonBase} group w-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-[#0767AD] sm:w-auto`}
              >
                {CTA_LABELS[cta.kind]}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>
              {!cta.isMember && (
                <Link
                  to={LOGIN_PATH}
                  className={`${buttonBase} w-full border border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto`}
                >
                  Log in
                </Link>
              )}
            </div>

            {!cta.isMember && (
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-[13px] text-white/70 xl:text-[14px]"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-green-primary"
                      strokeWidth={2.5}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </FadeUp>

          <FadeUp
            delay={0.12}
            className="mx-auto w-full max-w-[380px] lg:mx-0 xl:max-w-[440px] lg:justify-self-end"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-md xl:p-7">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {CONNECT_AVATARS.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-deep-blue xl:h-11 xl:w-11"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-white xl:text-[15px]">
                    +2,400 professionals
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/50 xl:text-[13px]">
                    joined this month
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-white/10" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                Everything in one place
              </p>
              <ul className="mt-3 space-y-3">
                {BENEFITS.map(({ icon, label }) => {
                  const BenefitIcon = icon;
                  return (
                    <li key={label} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <BenefitIcon
                          className="h-4 w-4 text-[#4FA9EC]"
                          strokeWidth={2.25}
                        />
                      </span>
                      <span className="text-[13px] font-medium text-white/85 xl:text-[14px]">
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
