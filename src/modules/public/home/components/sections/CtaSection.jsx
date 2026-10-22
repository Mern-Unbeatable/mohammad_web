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
    <section className="bg-[#F7F8FA] pb-16 lg:pb-20 xl:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[#E4ECF5] bg-gradient-to-br from-secondary via-white to-pink-secondary/60 px-6 py-10 shadow-sm sm:px-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]"
          />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 xl:gap-16">
            <FadeUp className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary xl:text-[12px]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {cta.isMember ? "Welcome back" : "Free to join"}
              </p>

              <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[32px] lg:mt-5 lg:text-[34px] xl:text-[42px] xl:leading-[1.12]">
                {cta.isMember ? "Continue With Your" : "Join the Laboratory"}{" "}
                <span className="text-primary">Professional Network</span>
              </h2>

              <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.7] text-[#64748B] lg:mx-0 lg:mt-5 xl:text-[16px]">
                {cta.isMember
                  ? "Pick up where you left off — your connections, conversations and opportunities are waiting."
                  : "Connect with laboratories, researchers and suppliers in one trusted professional environment."}
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-8 lg:justify-start">
                <Link
                  to={cta.to}
                  className={`${buttonBase} group w-full bg-primary text-white shadow-lg shadow-primary/20 hover:bg-[#0767AD] sm:w-auto`}
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
                    className={`${buttonBase} w-full border border-[#E4E7EC] bg-white text-deep-blue hover:bg-[#F8FAFC] sm:w-auto`}
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
                      className="flex items-center gap-2 text-[13px] text-[#475467] xl:text-[14px]"
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
              className="mx-auto w-full max-w-[380px] lg:mx-0 lg:justify-self-end xl:max-w-[440px]"
            >
              <div className="rounded-2xl bg-gradient-to-br from-deep-blue to-[#13265C] p-6 shadow-xl shadow-deep-blue/20 ring-1 ring-white/5 xl:p-7">
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
                    <p className="mt-0.5 text-[12px] text-white/60 xl:text-[13px]">
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
                        <span className="text-[13px] font-medium text-white/90 xl:text-[14px]">
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
